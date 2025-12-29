document.addEventListener("DOMContentLoaded", () => {

  const API = "http://localhost:5000/api/chat/chat";

  const fab = document.getElementById("chat-fab");
  const panel = document.getElementById("chat-panel");
  const closeBtn = document.getElementById("chat-close");

  const chatBody = document.getElementById("chat-body");
  const inputBox = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send");

  // Safety check (prevents crashes on pages without chatbot)
  if (!fab || !panel || !chatBody || !inputBox || !sendBtn) {
    console.warn("Chatbot not initialized on this page");
    return;
  }

  let bookingId = null;
  let chatEnded = false;

  /* ================= OPEN / CLOSE ================= */
  fab.onclick = () => {
    panel.style.display = "flex";
    inputBox.focus();

    if (chatBody.children.length === 0) {
      botMessage("<i class='fas fa-robot'></i> Hi! Please enter your Booking ID to continue.");
    }
  };

  closeBtn.onclick = () => {
    panel.style.display = "none";
  };

  sendBtn.onclick = sendMessage;
  inputBox.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
  });

  /* ================= UI HELPERS ================= */
  function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = `chat-msg ${sender}`;
    msg.innerHTML = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function botMessage(text) {
    addMessage(text, "bot");
  }

  function userMessage(text) {
    addMessage(text, "user");
  }

  function clearOptions() {
    document.querySelectorAll(".chat-options").forEach(el => el.remove());
  }

  function showOptions(options) {
    clearOptions();

    const wrap = document.createElement("div");
    wrap.className = "chat-options";

    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "chat-option";
      btn.textContent = opt.label;

      btn.onclick = () => {
        userMessage(opt.label);     // show readable label
        sendMessage(opt.value, true);
      };

      wrap.appendChild(btn);
    });

    chatBody.appendChild(wrap);
    chatBody.scrollTop = chatBody.scrollHeight;
  }


  function showTyping() {
  const t = document.createElement("div");
  t.className = "typing";
  t.id = "typing";
  t.innerHTML = "<span></span><span></span><span></span>";
  chatBody.appendChild(t);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function hideTyping() {
  document.getElementById("typing")?.remove();
}








  /* ================= SEND MESSAGE ================= */
  async function sendMessage(customText = null, isOption = false) {
    if (chatEnded) return;

    const text = customText || inputBox.value.trim();
    if (!text) return;

    if (!isOption) {
      userMessage(text);
    }

    inputBox.value = "";

    // Capture booking ID once
    if (!bookingId) {
      const match = text.match(/CRYPTO-\w+/i);
      if (match) {
        bookingId = match[0].toUpperCase();
      }
    }

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          bookingId: bookingId
        })
      });

      const data = await res.json();

      botMessage(data.reply);

      if (data.options) {
        showOptions(data.options);
      }

      if (data.end) {
        chatEnded = true;
        clearOptions();
        inputBox.disabled = true;
        sendBtn.disabled = true;
        inputBox.placeholder = "Support will reply here…";
      }

    } catch (err) {
      botMessage("⚠️ Unable to connect to support. Please try again later.");
    }
    showTyping();
// after fetch response
    hideTyping();

  }
// ELEMENTS
const toStep2Btn = document.getElementById("toStep2");
const amountInput = document.getElementById("purchaseAmount");

const stepContents = document.querySelectorAll(".step-content");
const steps = document.querySelectorAll(".step");

// PRESET BUTTONS
document.querySelectorAll(".amount-presets button").forEach(btn => {
  btn.addEventListener("click", () => {
    amountInput.value = btn.dataset.value;
  });
});

// CONTINUE TO STEP 2
toStep2Btn.addEventListener("click", () => {
  const amount = parseInt(amountInput.value);

  // VALIDATION
  if (isNaN(amount) || amount < 200 || amount > 15000) {
    alert("Please enter an amount between $200 and $15,000");
    return;
  }

  // HIDE STEP 1, SHOW STEP 2
  stepContents.forEach(c => c.classList.remove("active"));
  document.getElementById("step2").classList.add("active");

  // UPDATE STEP INDICATORS
  steps.forEach(s => s.classList.remove("active"));
  steps[1].classList.add("active"); // Step 2
});

});
