async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorDiv = document.getElementById("error");
  
    errorDiv.innerText = "";
  
    if (!email || !password) {
      errorDiv.innerText = "Please fill all fields";
      return;
    }
  
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
  
      const data = await res.json();
  
      if (data.success) {
        localStorage.setItem("adminToken", data.token);
  
        // Smooth redirect
        document.querySelector(".login-card").style.opacity = "0";
        setTimeout(() => {
          window.location.href = "/admin.html";
        }, 500);
        errorDiv.innerText = "Invalid admin credentials";
      }
    } catch (err) {
      errorDiv.innerText = "Server error. Try again.";
    }
  }
  