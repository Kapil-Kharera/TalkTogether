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
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks({}, {
        encoderConfig: {
            width: {
                min: 640,
                ideal: 1920,
                max: 1920
            },
            height: {
                min: 480,
                ideal: 1080,
                max: 1080
            }
        }
    });

    let player = `<div class="video__container" id="user-container-${uid}"> 
                    <div class="video-player" id="user-${uid}"></div>
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
        const videoFrame = document.getElementById(`user-container-${user.uid}`)
        videoFrame.style.width = "100px";
        videoFrame.style.height = "100px";
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

const toggleMic = async (e) => {
    const button = e.currentTarget;

    if(localTracks[0].muted) {
        await localTracks[0].setMuted(false);
        button.classList.add("active");
    }else {
        await localTracks[1].setMuted(true);
        button.classList.remove("active");
    }
}

const toggleCamera = async (e) => {
    const button = e.currentTarget;

    if(localTracks[1].muted) {
        await localTracks[1].setMuted(false);
        button.classList.add("active");
    }else {
        await localTracks[1].setMuted(true);
        button.classList.remove("active");
    }
}

document.getElementById("camera-btn").addEventListener("click", toggleCamera);
document.getElementById("mic-btn").addEventListener("click", toggleMic);

joinRoomInit();

//room.html?room=3242
