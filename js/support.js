// // ===============================
// // ELEMENTS
// // ===============================
// const convoList = document.querySelector(".conversations");
// const chatBox = document.querySelector(".chat");

// // ===============================
// // LOAD ALL CONVERSATIONS (ADMIN)
// // ===============================
// async function loadConversations() {
//   try {
//     const res = await fetch("http://localhost:5000/api/support");
//     const data = await res.json();

//     // Reset conversations panel
//     convoList.innerHTML = `<h3>💬 Conversations</h3>`;

//     // No conversations
//     if (!data || data.length === 0) {
//       convoList.innerHTML += `
//         <div class="empty">No support conversations yet</div>
//       `;
//       chatBox.innerHTML = `
//         <h3>Select a conversation</h3>
//         <div class="chat-empty">
//           💬
//           <p>Select a conversation to view messages</p>
//         </div>
//       `;
//       return;
//     }

//     // Render conversation list
//     data.forEach(convo => {
//       const item = document.createElement("div");
//       item.className = "conversation-item";
//       item.innerHTML = `
//         <strong>Booking ID:</strong> ${convo.bookingId}<br/>
//         <small>Status: ${convo.status || "open"}</small>
//       `;

//       item.addEventListener("click", () => openConversation(convo));
//       convoList.appendChild(item);
//     });

//   } catch (err) {
//     console.error("Error loading conversations:", err);
//     convoList.innerHTML += `<div class="empty">Failed to load conversations</div>`;
//   }
// }

// // ===============================
// // OPEN SINGLE CONVERSATION
// // ===============================
// function openConversation(convo) {
//   chatBox.innerHTML = `
//     <h3>Booking ID: ${convo.bookingId}</h3>

//     <div class="messages">
//       ${
//         convo.messages.length === 0
//           ? `<p class="empty">No messages yet</p>`
//           : convo.messages.map(m => `
//               <div class="msg ${m.sender}">
//                 <b>${m.sender === "admin" ? "Admin" : "User"}:</b>
//                 ${m.text}
//               </div>
//             `).join("")
//       }
//     </div>

//     <div class="reply">
//       <input
//         type="text"
//         id="replyText"
//         placeholder="Type your reply..."
//       />
//       <button onclick="sendReply('${convo.bookingId}')">
//         Send
//       </button>
//     </div>
//   `;
// }

// // ===============================
// // SEND ADMIN REPLY
// // ===============================
// async function sendReply(bookingId) {
//   const input = document.getElementById("replyText");
//   const text = input.value.trim();

//   if (!text) {
//     alert("Reply cannot be empty");
//     return;
//   }

//   try {
//     const res = await fetch("http://localhost:5000/api/support/reply", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ bookingId, text })
//     });

//     const data = await res.json();

//     if (!data.success) {
//       alert("Failed to send reply");
//       return;
//     }

//     input.value = "";
//     loadConversations(); // reload after reply

//   } catch (err) {
//     console.error("Reply error:", err);
//     alert("Server error while sending reply");
//   }
// }


// ===============================
// TOKEN HELPER
// ===============================
function getAdminToken() {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    window.location.href = "/admin-login.html";
    return null;
  }
  return token;
}

// ===============================
// ELEMENT REFERENCES
// ===============================
const convoList = document.getElementById("conversationList");
const chatBox = () => document.querySelector(".chat");

// ===============================
// LOAD ALL CONVERSATIONS (ADMIN)
// ===============================
async function loadConversations() {
  try {
    const token = getAdminToken();
    if (!token) return;

    const res = await fetch("/api/support", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch conversations");
    }

    const data = await res.json();
    convoList.innerHTML = "";

    // No conversations
    if (!data || data.length === 0) {
      convoList.innerHTML = `
        <div class="empty">No support conversations yet</div>
      `;
      return;
    }

    // Render conversations
    data.forEach(convo => {
      const div = document.createElement("div");
      div.className = "conversation-item";
      div.innerHTML = `
        <strong>${convo.bookingId}</strong><br/>
        <small>Status: ${convo.status || "open"}</small>
      `;

      div.onclick = () => openConversation(convo);
      convoList.appendChild(div);
    });

  } catch (err) {
    console.error("Load error:", err);
    convoList.innerHTML = `
      <div class="empty">Failed to load conversations</div>
    `;
  }
}

// ===============================
// OPEN A CONVERSATION
// ===============================
function openConversation(convo) {
  chatBox().innerHTML = `
    <h3>Booking ID: ${convo.bookingId}</h3>

    <div class="messages">
      ${
        convo.messages.length === 0
          ? `<p class="empty">No messages yet</p>`
          : convo.messages.map(m => `
              <div class="msg ${m.sender}">
                <b>${m.sender === "admin" ? "Admin" : "User"}:</b>
                ${m.text}
              </div>
            `).join("")
      }
    </div>

    <div class="reply">
      <input id="replyText" placeholder="Type reply..." />
      <button onclick="sendReply('${convo.bookingId}')">Send</button>
    </div>
  `;
}

// ===============================
// SEND ADMIN REPLY
// ===============================
async function sendReply(bookingId) {
  const input = document.getElementById("replyText");
  const text = input.value.trim();

  if (!text) return;

  try {
    const token = getAdminToken();
    if (!token) return;

    const res = await fetch("/api/support/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ bookingId, text })
    });

    if (!res.ok) {
      throw new Error("Reply failed");
    }

    input.value = "";
    loadConversations(); // reload list

  } catch (err) {
    console.error("Reply error:", err);
    alert("Failed to send reply");
  }
}

// ===============================
// INIT
// ===============================
loadConversations();
