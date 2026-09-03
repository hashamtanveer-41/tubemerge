from pydantic import BaseModel
from tubemerge.apps.binaries.schemas.item_schema import BinaryItemSchema

class InstallBinariesResponseSchema(BaseModel):
    status: str
    message: str
    ffmpeg: BinaryItemSchema
    ytdlp: BinaryItemSchema
