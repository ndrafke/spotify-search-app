import React from 'react'

export default function TrackSearchResult({track, selectTrack}) {
    function handlePlay() {
        selectTrack(track)
    }
    return (
        <div className="d-flex m-1 align-items-center" style={{cursor: "pointer"}} onClick={handlePlay}> 
          <img src={track.albumUrl} style={{height: "60px", width: "60px"}} />  
          <div className="ml-2">
              <div>{track.title}</div>
              <div>{track.artist}</div>
          </div>
        </div>
    )
}
