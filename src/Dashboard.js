import {useState, useEffect} from 'react'
import useAuthorization from './useAuthorization'
import TrackSearchResult from './TrackSearchResult'
import TrackPlayer from './TrackPlayer'
import {Container, Form} from 'react-bootstrap'
import SpotifyWebApi from "spotify-web-api-node"
import axios from 'axios'

const spotifyApi = new SpotifyWebApi({
    clientId: "7e7953836b5d45c597f891191a382e25",
})
export default function Dashboard({code}) {
    const accessToken = useAuthorization(code);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [playingTrack, setPlayingTrack] = useState();
    const [lyrics, setLyrics] = useState("");
    
    function selectTrack(track){
        setPlayingTrack(track);
        setSearch("");
        setLyrics("");
    }

    useEffect(() => {
        if(!playingTrack) return
        axios.get('http://localhost:3001/lyrics', { 
            params: {
                track: playingTrack.title,
                artist: playingTrack.artist
            }
        }).then(res => {
            setLyrics(res.data.lyrics)
        })
    }, [playingTrack])

    useEffect(() => {
        if (!accessToken) return 
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    useEffect(() => {
        if(!search) return setSearchResults([]);
        if(!accessToken) return
        let cancel = false;
        spotifyApi.searchTracks(search).then(res => {
            if(cancel) return
            setSearchResults(res.body.tracks.items.map(track => {
                const smallestImage = track.album.images.reduce((smallest, image) => {
                    if(image.height < smallest.height) return image
                    return smallest
                }, track.album.images[0])
                return {
                    artist: track.artists[0].name,
                    title: track.name,
                    uri: track.uri,
                    albumUrl: smallestImage.url
                }
            }))
        })
        return () => cancel = true
    }, [search, accessToken])
    return (
        <Container className="d-flex flex-column" style={{height: "100vh"}}>
            <Form.Control
             type="search" placeholder="Search" value={search} onChange={event => setSearch(event.target.value)} 
             />
        <div className="flex-grow-1 my-2" style={{overflowY: "auto"}}>
            {searchResults.map(track => (
               <TrackSearchResult 
               track={track} 
               key={track.uri} 
               selectTrack={selectTrack}
               /> 
            ))}
            {searchResults.length === 0 && (
                <div className="text-center" style={{whiteSpace: "pre"}}>
                    {lyrics}
                    </div>
            )}
            </div>
            <div>
                <TrackPlayer 
                accessToken={accessToken}
                trackUri={playingTrack?.uri}
                />
                </div>     
        </Container>
    )
}
