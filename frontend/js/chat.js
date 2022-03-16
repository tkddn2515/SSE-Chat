let username = prompt("아이디를 입력하세요.");
let roomNum = prompt("채팅방번호를 입력하세요.");

// SSE 연결하기
const eventSource = new EventSource(`http://localhost:8080/chat/roomNum/${roomNum}`);

eventSource.onmessage = (e) => {

  const data = JSON.parse(e.data);
  console.log(data);
  if(data.sender === username) {
    initMyMessage(data);
  } else {
    initOtherMessage(data);
  }
}

let msgBox = document.querySelector("#chat-outgoing-msg");
let chatBox = document.querySelector("#chat-box");
function getMyMsg(msg, time) {
  return `<div class="sent_msg">
  <p>${msg} </p>
  <span class="time_date"> ${time}</span>
</div>`
}

function getOtherMsg(sender, msg, time) {
  return `<div class="received_msg">
  <div class="received_withd_msg">
  <span class="time_date"> ${sender}</span>
  <p>${msg}</p>
    <span class="time_date"> ${time}</span>
  </div>
</div>`
}

function initMyMessage(data) {
  let chatOutgoingBox = document.createElement("div");
  chatOutgoingBox.className = "outgoing_msg";
  let md = data.createdAt.substring(5,10)
  let tm = data.createdAt.substring(11,16)
  let convertTime = tm + " | " + md
  chatOutgoingBox.innerHTML = getMyMsg(data.msg, convertTime);
  chatBox.append(chatOutgoingBox);

  document.documentElement.scrollTop = document.body.scrollHeight;
}

function initOtherMessage(data) {
  let chatOutgoingBox = document.createElement("div");
  chatOutgoingBox.className = "incoming_msg";
  let md = data.createdAt.substring(5,10)
  let tm = data.createdAt.substring(11,16)
  let convertTime = tm + " | " + md
  chatOutgoingBox.innerHTML = getOtherMsg(data.sender, data.msg, convertTime);
  chatBox.append(chatOutgoingBox);

  document.documentElement.scrollTop = document.body.scrollHeight;
}

function addMessage() {
  if(msgBox.value.length === 0) {
    return;
  }

  let chat = {
    sender: username,
    roomNum,
    msg: msgBox.value
  };

  fetch("http://localhost:8080/chat", {
    method: "post",
    body: JSON.stringify(chat),
    headers: {
      "Content-Type": "application/json; chatset=utf-8"
    }
  })

  msgBox.value = '';
}


document.querySelector("#chat-send").addEventListener("click", () => {
  addMessage();
});

document.querySelector("#chat-outgoing-msg").addEventListener("keydown", (e) => {
  if(e.keyCode === 13) {
    addMessage();
  }
});