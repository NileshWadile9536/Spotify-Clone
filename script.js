
let currentFolder = "";
let currentSong = new Audio();
let songs;

// async function getAlbums() {
//     let folders = await fetch("/songs/songs.json");
//     folders = await folders.json();
//     let albums = [];
//     for (const folder of folders) {
//         let info = await fetch(`/songs/${folder}/info.json`);
//         info = await info.json();
//         albums.push({
//             folder: folder,
//             ...info
//         });
//     }
//     return albums;
// }

async function getAlbums() {
    let response = await fetch("/songs/songs.json");
    if (!response.ok) {
        throw new Error("songs.json not found: " + response.status);
    }
    let folders = await response.json();
    let albums = [];
    for (const folder of folders) {
        let infoResponse = await fetch(
            `/songs/${encodeURIComponent(folder)}/info.json`
        );
        if (!infoResponse.ok) {
            console.error(
                `info.json not found for folder: ${folder}`
            );
            continue;
        }
        let info = await infoResponse.json();
        albums.push({
            folder: folder,
            title: info.title,
            description: info.description
        });
    }
    return albums;
}

// async function getSongs(folder) {

//     let a = await fetch("http://127.0.0.1:3000/songs/")
//     let a = await fetch(`/songs/${folder}/`)
//     let response = await a.text();
//     let div = document.createElement("div")
//     div.innerHTML = response;
//     let as = div.getElementsByTagName("a")
//     let songs = []
//     for (let index = 0; index < as.length; index++) {
//         const element = as[index];
//         if (element.href.endsWith(".mp3")) {
//             songs.push(decodeURIComponent(element.href)
//                 .replace(/\\/g, "/")
//                 .split("/")
//                 .pop()
//             );
//         }
//     }
//     return songs
// }

async function getSongs(folder) {
    let a = await fetch(`/songs/${folder}/info.json`);
    let info = await a.json();
    return info.songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/songs/${currentFolder}/${track}`;
    if (!pause) {
        currentSong.play();
        play.src = "pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURIComponent(track);
    // document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
    document.querySelector(".currentTime").innerHTML = "00:00";
    document.querySelector(".totalTime").innerHTML = "00:00";
}

async function main() {

    // get the list of all the songs
    // songs = await getSongs()
    // playMusic(songs[0], true)

    let albums = await getAlbums();
    console.log(albums);
    let cardContainer = document.querySelector(".cardcontainer");
    for (const album of albums) {
        cardContainer.innerHTML += `
<div class="card" data-folder="${album.folder}">
    <div class="play">
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50">
            <circle cx="25" cy="25" r="25" fill="#1ed760"/>
            <path d="M20 15 L20 35 L36 25 Z" fill="black"/>
        </svg>
    </div>
    <img src="/songs/${encodeURIComponent(album.folder)}/cover.jpg" alt="">
    <h2>${album.title}</h2>
    <p>${album.description}</p>
</div>
`;
}

    // async function getAlbums() {
    //     let a = await fetch("/songs/");
    //     let response = await a.text();
    //     let div = document.createElement("div");
    //     div.innerHTML = response;
    //     let folders = [];
    //     Array.from(div.getElementsByTagName("a")).forEach(e => {
    //         if (e.href.includes("/songs/")) {
    //             let folder = e.href.split("/").slice(-2)[0];
    //             if (!folders.includes(folder)) {
    //                 folders.push(folder);
    //             }
    //         }
    //     });
    //     return folders;
    // }


    //show all the songs in the playlist 
    // let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    // for (const song of songs) {
    //     songUL.innerHTML = songUL.innerHTML + `<li> <img src="music.svg" alt="">
    //                     <div class="info">
    //                         <div>${song.replaceAll("%20", " ")}</div>
    //                         <div>Song Artist</div>
    //                     </div>
    //                     <div class="playnow">
    //                         <span>Play Now</span>
    //                         <img class="invert" src="play.svg" alt="">
    //                     </div> </li>`;
    // }

    // //Attach an event listener to each song
    // Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    //     e.addEventListener("click", element => {
    //         console.log(e.querySelector(".info").firstElementChild.innerHTML)
    //         playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

    //     })
    // })

    //Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        } else {
            currentSong.pause();
            play.src = "play.svg";
        }
    });

    // Listen for timeupdate event
    // currentSong.addEventListener("timeupdate", () => {
    //     console.log(currentSong.currentTime);
    //     console.log(currentSong.duration);
    //     document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
    //     let percent = (currentSong.currentTime / currentSong.duration) * 100;
    //     document.querySelector(".circle").style.left = percent + "%";
    //     document.querySelector(".progress").style.width = percent + "%";

    // });
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".currentTime").innerHTML =
            formatTime(currentSong.currentTime);
        document.querySelector(".totalTime").innerHTML =
            formatTime(currentSong.duration);
        let percent = (currentSong.currentTime / currentSong.duration) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        document.querySelector(".progress").style.width = percent + "%";
    });


    function formatTime(seconds) {

        if (isNaN(seconds)) return "00:00";
        let minutes = Math.floor(seconds / 60);
        let secs = Math.floor(seconds % 60);
        if (secs < 10) {
            secs = "0" + secs;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        return `${minutes}:${secs}`;
    }

    //Attach an event listener to seekbar 
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let seekbar = e.currentTarget;
        // Mouse click ki position
        let percent = (e.offsetX / seekbar.getBoundingClientRect().width) * 100;
        // Circle aur progress update
        document.querySelector(".circle").style.left = percent + "%";
        document.querySelector(".progress").style.width = percent + "%";
        // Song seek
        currentSong.currentTime = (currentSong.duration * percent) / 100;

    });

    //Attach an event listener for  hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    //Attach an event listener for  close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })

    //Attach an event listener for previous
    previous.addEventListener("click", () => {
        console.log("previous clicked");
        console.log(currentSong);
        // let index = songs.indexOf(currentSong.src.split("/"). slice(-1) [0])
        // let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").pop()));
        // let currentTrack = decodeURIComponent(currentSong.src.split("/").pop());
        let currentTrack = decodeURIComponent(currentSong.src.split("/").pop());
        let index = songs.indexOf(currentTrack);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Attach an event listener for next
    next.addEventListener("click", () => {
        // currentSong.pause()
        console.log("next clicked");
        // let index = songs.indexOf(currentSong.src.split("/"). slice(-1) [0])
        // let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").pop()));
        let currentTrack = decodeURIComponent(currentSong.src.split("/").pop());
        let index = songs.indexOf(currentTrack);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // attach an event for volume
    const volume = document.getElementById("volume");
    const volumeIcon = document.getElementById("volumeIcon");
    volume.addEventListener("input", () => {
        let value = volume.value;
        currentSong.volume = volume.value / 100;
        if (value == 0) {
            volumeIcon.src = "mute.svg";
        }
        else if (value <= 50) {
            volumeIcon.src = "volume-low.svg";
        }
        else {
            volumeIcon.src = "volume.svg";
        }
    });

    // add play button in cards
    document.querySelectorAll(".card").forEach(card => {
        if (!card.querySelector(".play")) {
            card.insertAdjacentHTML("afterbegin", `
            <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
                    <circle cx="25" cy="25" r="25" fill="#1ed760"/>
                    <path d="M20 15 L20 35 L36 25 Z" fill="black"/>
                </svg>
            </div>
        `);

        }
    });

    // add event for card
    // document.querySelectorAll(".card").forEach((card, index) => {
    //     card.addEventListener("click", () => {
    //         playMusic(songs[index]);
    //     });
    // });

    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", async () => {
            let folder = card.dataset.folder;
            console.log(folder);
            currentFolder = folder;
            songs = await getSongs(folder);                                    
            document.getElementById("libraryTitle").innerText =
                "Your Library: " + card.querySelector("h2").innerText;

            // songs = await getSongs(folder);
            let songUL = document.querySelector(".songList ul");
            songUL.innerHTML = "";
            for (const song of songs) {
                songUL.innerHTML += `
                <li>
                    <img src="music.svg">
                    <div class="info">
                        <div>${song}</div>
                        <div>Unknown Artist</div>
                    </div>
                    <div class="playnow">
                        <span>Play Now</span>
                        <img class="invert" src="play.svg">
                    </div>
                </li>
            `;
            }

            Array.from(songUL.getElementsByTagName("li")).forEach(li => {
                li.addEventListener("click", () => {
                    let track = li.querySelector(".info div").innerText.trim();

                    // currentSong.src = `/songs/${folder}/${track}`;
                    playMusic(track);
                    // currentSong.play();
                    play.src = "pause.svg";
                    document.querySelector(".songinfo").innerText = track;
                });
            });
        });
    });
}
main()