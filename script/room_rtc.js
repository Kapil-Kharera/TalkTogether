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

    joinStream();
}

const joinStream = async () => {
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

    let player = `<div class="video__container" id="user-conatainer-${uid}"> 
                    <div class="video-player" id="user-${uid}"></div>
                </div>`;
    
    document.getElementById("stream__container").insertAdjacentHTML("beforeend", player);

    localTracks[1].play(`user-${uid}`);
}

joinRoomInit();

//room.html?room=3242
