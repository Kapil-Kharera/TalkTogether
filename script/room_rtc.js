const APP_ID = "";

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

    const player = `<div class="video__container" id="user-conatainer-${uid}"> 
                    <div class="video-player" id="user-${uid}"></div>
                </div>`;
    
    document.getElementById("stream__container").insertAdjacentHTML("beforeend", player);

    localTracks[1].play(`user-${uid}`);

    await client.publish([localTracks[0], localTracks[1]]);
}

const handleUserPublished = async (user, mediaType) => {
    remoteUsers[user.uid] = user;

    await client.subscribe(user, mediaType);

    let player = document.getElementById(`user-container-${user.id}`);

    if(player === null) {
        player = `<div class="video__container" id="user-conatainer-${user.uid}"> 
                    <div class="video-player" id="user-${user.uid}"></div>
                </div>`;

        document.getElementById("streams__container").insertAdjacentHTML("beforeend", player);
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
}

joinRoomInit();

//room.html?room=3242
