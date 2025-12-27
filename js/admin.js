// ===============================
// ADMIN AUTH GUARD
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    window.location.href = "/admin-login.html";
    return;
  }
});

// ===============================
// ADMIN LOGIN
// ===============================
document
  .getElementById("adminLoginForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("adminToken", data.token);
      alert("Admin login successful");
      window.location.href = "admin.html";
    } else {
      alert(data.message || "Login failed");
    }
  });

// ===============================
// LOAD SUPPORT SECTION
// ===============================
function loadSupport() {
  document.getElementById("mainContent").innerHTML = `
    <section class="support">

      <div class="card conversations">
        <h3><i class="fas fa-comments"></i> Conversations</h3>
        <div id="conversationList"></div>
      </div>

      <div class="card chat">
        <h3>Select a conversation</h3>

        <div class="chat-empty">
          <i class="fas fa-comments"></i>
          <p>Select a conversation to view messages</p>
        </div>
      </div>

    </section>
  `;

  // Call support loader AFTER DOM is inserted
  loadConversationsWithAuth();
}
