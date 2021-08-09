import React from 'react';
import {Container} from 'react-bootstrap';

const AUTH_URL = 'https://accounts.spotify.com/authorize?client_id=7e7953836b5d45c597f891191a382e25&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state';

export default function Login() {
    return (
        <Container style={{minHeight: '100vh'}} className="d-flex justify-content-center align-items-center">
        <a className="btn btn-success btn-md" href={AUTH_URL}>Login to Spotify</a>
        </Container>
    )
}
