const API = "http://localhost:5000";
const convoList = document.querySelector(".conversations");
const messagesBox = document.querySelector(".messages");
let currentBooking = null;

async function loadConversations() {
  const res = await fetch(`${API}/api/support`);
  const data = await res.json();

  convoList.innerHTML = "";
  data.forEach(c => {
    const div = document.createElement("div");
    div.innerText = c.bookingId;
    div.onclick = () => loadMessages(c.bookingId);
    convoList.appendChild(div);
  });
}

async function loadMessages(bookingId) {
  currentBooking = bookingId;
  const res = await fetch(`${API}/api/support/${bookingId}`);
  const data = await res.json();

  messagesBox.innerHTML = "";
  data.messages.forEach(m => {
    const div = document.createElement("div");
    div.className = m.sender;
    div.innerText = m.text;
    messagesBox.appendChild(div);
  });
}

async function sendReply(text) {
  await fetch(`${API}/api/support/reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bookingId: currentBooking,
      text
    })
  });

  loadMessages(currentBooking);
}

loadConversations();
