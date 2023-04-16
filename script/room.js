const messageContainer = document.getElementById("messages");
messageContainer.scrollTop = messageContainer.scrollHeight;

const memberContainer = document.getElementById("members__container");
const memberButton = document.getElementById("members__button");

const chatContainer = document.getElementById("message__container");
const chatButton = document.getElementById("chat__button");

const activeMemberContainer = false;

memberButton.addEventListener("click", () => {
    if(activeMemberContainer) {
        memberContainer.style.display = "none";
    }else {
        memberContainer.style.display = "block";
    }

    activeMemberContainer = !activeMemberContainer;
});

const activeChatContainer = false;

chatButton.addEventListener("click", () => {
    if(activeChatContainer) {
        chatContainer.style.display = "none";
    }else {
        chatContainer.style.display = "block";
    }

    activeChatContainer = !activeChatContainer;
});

const displayFrame = document.getElementById("stream__box");
const videoFrames = document.getElementsByClassName("video__container");
let userIdInDisplayFrame = null;

const expandVideoFrame = (e) => {
    const child = displayFrame.children[0];

    if(child) {
        document.getElementById("streams__container").appendChild(child);
    }

    displayFrame.style.display = "block";
    displayFrame.appendChild(e.currentTarget);
    userIdInDisplayFrame = e.currentTarget.id;

    for(let i = 0; videoFrames.length > i; i++) {
        if(videoFrames[i].id !== userIdInDisplayFrame) {
            videoFrames[i].style.width = "100px";
            videoFrames[i].style.height = "100px";
        }
    }

}

for(let i = 0; videoFrames.length > i; i++) {
    videoFrames[i].addEventListener("click", expandVideoFrame);
}

const hideDisplayFrame = () => {
    userIdInDisplayFrame = null;
    displayFrame.style.display = null;
    const child = displayFrame.children[0];
    document.getElementById("streams__container").appendChild(child);

    for(let i = 0; videoFrames.length > i; i++) {
        videoFrames[i].style.width = "300px";
        videoFrames[i].style.height = "300px";
    }
}

displayFrame.addEventListener("click", hideDisplayFrame);

