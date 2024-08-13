const chatForm = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get Username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

const socket = io();

// Join Chatroom
 
socket.emit("joinRoom",{username,room});

// Get room and users

socket.on("roomUsers",({room,users})=>
{
    outputRoomName(room);
    outputUsers(users)
})

// Message from Server

socket.on("message",message=>           
{
    console.log(message); 
    outputMessage(message);

    // Scroll Down
    chatMessage.scrollTop = chatMessage.scrollHeight;
});

// Message Submit

chatForm.addEventListener("submit",(e)=>
{
    e.preventDefault();
    const msg = e.target.elements.msg.value;

    // Emit Message to Server

    socket.emit("chatMessage",msg);
    
    // Clear Input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

})   

// OutMessage from Dom 

function outputMessage(message)
{
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// add roomname to dom

function outputRoomName(room)
{
    roomName.innerHTML = room;
}

// add user to dom

function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
  }



const levaeBtn = document.getElementById('leave-btn');
levaeBtn.addEventListener('click',()=>
{
    const leaveroom = confirm("Are you sure you want to leave the chatroom?");
    if(leaveroom)
    {
        window.location = "../index.html";
    }
})