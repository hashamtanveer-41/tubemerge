"""Pydantic schemas for merge operations."""

from typing import List, Optional
from pydantic import BaseModel

class StartMergeRequest(BaseModel):
    url: str
    selected_indices: List[int]
    output_dir: Optional[str] = None
    output_filename: Optional[str] = None
    canvas_preset: Optional[str] = "auto"
    crf: Optional[int] = 21

class StartMergeResponse(BaseModel):
    status: str
    job_id: str

class CancelResponse(BaseModel):
    status: str
    message: str
