document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("https://crypto-pro-5.onrender.com/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem("adminToken", data.token);
    window.location.href = "admin.html";
  } else {
    document.getElementById("error").innerText =
      "Invalid admin credentials";
  }
});
