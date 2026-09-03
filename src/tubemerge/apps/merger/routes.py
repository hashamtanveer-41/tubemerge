from typing import Optional
from fastapi import APIRouter, Header
from tubemerge.apps.merger.controllers import MergeController
from tubemerge.apps.merger.schemas import StartMergeRequest, StartMergeResponse, CancelResponse

router = APIRouter(prefix="/api", tags=["merger"])
controller = MergeController()

@router.post("/start-merge", response_model=StartMergeResponse)
async def start_merge(payload: StartMergeRequest, authorization: Optional[str] = Header(None)):
    return await controller.start_merge(payload, authorization)

@router.get("/progress")
async def stream_progress():
    return await controller.stream_progress()

@router.post("/cancel", response_model=CancelResponse)
def cancel_merge():
    return controller.cancel_merge()
