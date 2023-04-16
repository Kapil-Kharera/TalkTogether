const APP_ID = "d8dfcead48124b1e8a3fd5fe1b9f76fa";

let uid = sessionStorage.getItem('uid');

if(!uid) {
    uid = String(Math.floor(Math.random() * 1000));
    sessionStorage.setItem('uid', uid);
}

let token = null;
let client;

const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);

let roomId = urlParams.get('room');

if(!roomId) {
    roomId = 'main';
}

let localTracks = [];
let remoteUsers = {};

const joinRoomInit = async () => {
    client = AgoraRTC.createClient({mode: 'rtc', codec: 'vp8'});
    await client.join(APP_ID, roomId, token, uid);

    client.on('user-published', handleUserPublished);
    client.on('user-left', handleUserLeft);

    joinStream();
}

const joinStream = async () => {
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

    let player = `<div class="video__container" id="user-container-${uid}"> 
                    // <div class="video-player" id="user-${uid}"></div>
                </div>`;
    
    document.getElementById("streams__container").insertAdjacentHTML("beforeend", player);

    document.getElementById(`user-container-${uid}`).addEventListener("click", expandVideoFrame);

    localTracks[1].play(`user-${uid}`);

    await client.publish([localTracks[0], localTracks[1]]);
}

const handleUserPublished = async (user, mediaType) => {
    remoteUsers[user.uid] = user;

    await client.subscribe(user, mediaType);

    let player = document.getElementById(`user-container-${user.id}`);

    if(player === null) {
        player = `<div class="video__container" id="user-container-${user.uid}"> 
                    <div class="video-player" id="user-${user.uid}"></div>
                </div>`;

        document.getElementById("streams__container").insertAdjacentHTML("beforeend", player);

        document.getElementById(`user-container-${user.uid}`).addEventListener("click", expandVideoFrame);
    }

    if(displayFrame.style.display) {
        player.style.width = "100px";
        player.style.height = "100px";
    }

    if(mediaType === 'video') {
        user.videoTrack.play(`user-${user.uid}`);
    }

    if(mediaType === 'audio') {
        user.audioTrack.play();
    }  
}

const handleUserLeft = async (user) => {
    delete remoteUsers[user.uid];
    document.getElementById(`user-container-${user.uid}`).remove();

    if(userIdInDisplayFrame === `user-container-${user.uid}`) {
        displayFrame.style.display = null;
        const videoFrames = document.getElementsByClassName("video__container");

        for(let i = 0; videoFrames.length > i; i++) {
            videoFrames[i].style.width = "300px";
            videoFrames[i].style.height = "300px";
        }
    }
}

joinRoomInit();

//room.html?room=3242
