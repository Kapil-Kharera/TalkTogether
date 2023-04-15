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
})