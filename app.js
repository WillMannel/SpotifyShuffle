// app.js
const clientId = 'YOUR_SPOTIFY_CLIENT_ID';
const redirectUri = 'http://localhost:3000'; // Adjust based on your server
const scopes = 'user-read-playback-state user-modify-playback-state';
let accessToken = null;

function login() {
    const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=token&show_dialog=true`;
    window.location = url;
}

window.onload = () => {
    const hash = window.location.hash;
    if (hash) {
        const token = hash.match(/access_token=([^&]*)/);
        accessToken = token ? token[1] : null;
        if (accessToken) {
            document.getElementById('login').style.display = 'none';
            document.getElementById('player').style.display = 'block';
        }
    }
};

function fetchAPI(url, method = 'GET') {
    return fetch(url, {
        method: method,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(response => response.json());
}

function togglePlay() {
    fetchAPI(`https://api.spotify.com/v1/me/player/play`, 'PUT');
}

function nextTrack() {
    fetchAPI(`https://api.spotify.com/v1/me/player/next`, 'POST')
        .then(() => fetchAPI(`https://api.spotify.com/v1/me/player/currently-playing`))
        .then(data => {
            document.getElementById('current-track').textContent = data.item.name;
        });
}

function previousTrack() {
    fetchAPI(`https://api.spotify.com/v1/me/player/previous`, 'POST')
        .then(() => fetchAPI(`https://api.spotify.com/v1/me/player/currently-playing`))
        .then(data => {
            document.getElementById('current-track').textContent = data.item.name;
        });
}
