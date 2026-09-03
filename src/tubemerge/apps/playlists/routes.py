from fastapi import APIRouter
from tubemerge.apps.playlists.controllers import PlaylistController
from tubemerge.apps.playlists.schemas import FetchPlaylistRequest, FetchPlaylistResponse

router = APIRouter(prefix="/api", tags=["playlists"])
controller = PlaylistController()

@router.post("/fetch-playlist", response_model=FetchPlaylistResponse)
def fetch_playlist(payload: FetchPlaylistRequest):
    return controller.fetch_playlist(payload)
