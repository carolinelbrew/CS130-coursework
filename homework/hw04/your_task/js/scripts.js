const baseURL = 'https://www.apitutor.org/spotify/simple/v1/search';

// Note: AudioPlayer is defined in audio-player.js
const audioFile = 'https://p.scdn.co/mp3-preview/bfead324ff26bdd67bb793114f7ad3a7b328a48e?cid=9697a3a271d24deea38f8b7fbfa0e13c';
const audioPlayer = AudioPlayer('.player', audioFile);

const search = (ev) => {
    const term = document.querySelector('#search').value;
    console.log('search for:', term);
    // issue three Spotify queries at once...
    getTracks(term);
    getAlbums(term);
    getArtist(term);
    if (ev) {
        ev.preventDefault();
    }
}
      
const getTracks = (term) => {
    console.log(`
        get tracks from spotify based on the search term
        "${term}" and load them into the #tracks section 
        of the DOM...`);
    const elem = document.querySelector("#tracks");
    elem.innerHTML = "";
    fetch(baseURL + "?type=track&q=" + term)
        .then((data) => data.json())
        .then((data) => {
            console.log("tracks: ", data);
            const firstFive = data.slice(0,5);
            for(const artistData of firstFive) {
                elem.innerHTML += getTrackHTML(artistData);
        }

            });
};
const getTrackHTML = (data) => {
    return `<button class="track-item preview" data-preview-track="${data.preview_url}" onclick="handleTrackClick(event);">
    <img src="${data.album.image_url}">
    <i class="fas play-track fa-play" aria-hidden="true"></i>
    <div class="label">
        <h2>${data.name}</h2>
        <p>
            ${data.artist.name}
        </p>
    </div>
</button>`;
};

const getAlbums = (term) => {
    console.log(`
        get albums from spotify based on the search term
        "${term}" and load them into the #albums section 
        of the DOM...`);
    const elem = document.querySelector("#albums");
    elem.innerHTML = "";
    fetch(baseURL + "?type=album&q=" + term)
        .then((data) => data.json())
        .then((data) => {

            for (const albumData of data) {
                console.log("albums: ", albumData);
                elem.innerHTML += getAlbumHTML(albumData);

            }
        });
           
};

const getAlbumHTML = (data) => {
    return `<section class="album-card" id="${data.id}"">
    <div>
        <img alt="album from ${data.name}" src="${data.image_url}">
        <h2>${data.name}</h2>
        <div class="footer">
            <a href="${data.spotify_url}" target="_blank">
                view on spotify
            </a>
        </div>
    </div>
</section>`
}

const getArtist = (term) => {
    const elem = document.querySelector("#artist");
    elem.innerHTML = "";
    fetch(baseURL + "?type=artist&q=" + term)
        .then((data) => data.json())
        .then((data) => {
            console.log(data);
            if(data.length > 0) {
                const firstArtist = data[0];
                console.log("test", firstArtist);
                elem.innerHTML += getArtistHTML(firstArtist);
            } else {
                elem.innerHTML = "artist not found";
                
            }

        });

};

const getArtistHTML = (data) => {
    console.log('test2:', data);
    return `<section class="artist-card" id="${data.id}">
    <div>
        <img src="${data.image_url}">
        <h2>${data.name}</h2>
        <div class="footer">
            <a href="${data.spotify_url}" target="_blank">
                view on spotify
            </a>
        </div>
    </div>
</section>`;

};


const handleTrackClick = (ev) => {
    const previewUrl = ev.currentTarget.getAttribute('data-preview-track');
    console.log(previewUrl);

    audioPlayer.setAudioFile(previewUrl);
    audioPlayer.play();

    document.querySelector("#current-track").innerHTML=ev.currentTarget.innerHTML
}


document.querySelector('#search').onkeyup = (ev) => {
    // Number 13 is the "Enter" key on the keyboard
    console.log(ev.keyCode);
    if (ev.keyCode === 13) {
        ev.preventDefault();
        search();
    }
};
