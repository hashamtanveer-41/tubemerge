import asyncio
import json
import uuid
from typing import Optional, List
from fastapi import HTTPException
from fastapi.responses import StreamingResponse

from tubemerge.apps.binaries.services import BinaryService
from tubemerge.apps.merger.models import ProgressSnapshot, PipelineStatus, MergeJobSpecification
from tubemerge.apps.merger.schemas import StartMergeRequest, StartMergeResponse, CancelResponse
from tubemerge.apps.merger.services.engine import MergeEngine
from tubemerge.apps.licensing.services.license_service import LicenseService
from tubemerge.apps.licensing.services.telemetry_service import TelemetryService

class MergeController:
    def __init__(self):
        self.binary_service = BinaryService()
        self.active_engine: Optional[MergeEngine] = None
        self.progress_queues: List[asyncio.Queue] = []

    async def start_merge(self, payload: StartMergeRequest) -> StartMergeResponse:
        if self.active_engine and self.active_engine.is_running:
            raise HTTPException(
                status_code=409,
                detail={"error": "A merge job is already currently running."}
            )

        # 1. Operational Quota Enforcement
        license_info = LicenseService.get_license_status()
        is_pro = license_info.get("plan_tier") in ("PRO", "STUDIO", "LIFETIME")
        daily_limit = 100 if is_pro else 3
        usage = TelemetryService.get_daily_usage(daily_quota=daily_limit)

        if usage["requests_today"] >= daily_limit:
            raise HTTPException(
                status_code=429,
                detail={"error": f"Daily merge limit reached ({usage['requests_today']}/{daily_limit}). Upgrade to Creator Pro for unlimited merges."}
            )

        # 2. Binary Validation
        try:
            ffmpeg_p = self.binary_service.get_ffmpeg_path()
            ytdlp_p = self.binary_service.get_ytdlp_path()
            ffprobe_p = None
            try:
                ffprobe_p = self.binary_service.get_ffprobe_path()
            except Exception:
                pass
        except FileNotFoundError as exc:
            raise HTTPException(status_code=503, detail={"error": str(exc)})

        # Record merge start request in telemetry
        TelemetryService.record_request("/api/merger/start-merge", 200)

        job_spec = MergeJobSpecification(
            playlist_url=payload.url,
            selected_indices=payload.selected_indices,
            output_dir=payload.output_dir,
            output_filename=payload.output_filename,
            canvas_preset=payload.canvas_preset or "auto",
            crf=payload.crf or 21,
        )

        loop = asyncio.get_running_loop()

        def on_progress(snapshot: ProgressSnapshot):
            for q in list(self.progress_queues):
                loop.call_soon_threadsafe(q.put_nowait, snapshot)
            if snapshot.status in (PipelineStatus.DONE, PipelineStatus.ERROR, PipelineStatus.CANCELLED):
                self.active_engine = None

        self.active_engine = MergeEngine(
            job_spec=job_spec,
            ytdlp_path=ytdlp_p,
            ffmpeg_path=ffmpeg_p,
            ffprobe_path=ffprobe_p,
            on_progress=on_progress,
        )

        self.active_engine.start()
        return StartMergeResponse(status="started", job_id=uuid.uuid4().hex[:8])

    async def stream_progress(self) -> StreamingResponse:
        q: asyncio.Queue = asyncio.Queue()
        self.progress_queues.append(q)

        async def event_generator():
            try:
                while True:
                    try:
                        snapshot: ProgressSnapshot = await asyncio.wait_for(q.get(), timeout=15.0)
                        data = {
                            "status": snapshot.status.value,
                            "current_item": snapshot.current_item,
                            "total_items": snapshot.total_items,
                            "current_video_title": snapshot.current_video_title,
                            "overall_percent": round(snapshot.overall_percent, 1),
                            "message": snapshot.message,
                            "output_file": snapshot.output_file,
                            "error": snapshot.error,
                        }
                        yield f"data: {json.dumps(data)}\n\n"

                        if snapshot.status in (PipelineStatus.DONE, PipelineStatus.ERROR, PipelineStatus.CANCELLED):
                            break
                    except asyncio.TimeoutError:
                        yield ": keepalive\n\n"
            finally:
                if q in self.progress_queues:
                    self.progress_queues.remove(q)

        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no",
                "Connection": "keep-alive",
            },
        )

    def cancel_merge(self) -> CancelResponse:
        if self.active_engine:
            self.active_engine.cancel()
            return CancelResponse(status="cancelling", message="Cancellation token dispatched.")
        return CancelResponse(status="idle", message="No active job found.")
