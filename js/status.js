document.addEventListener("DOMContentLoaded", () => {

  const API_BASE = "https://crypto-pro-2.onrender.com";

  const btn = document.getElementById("checkStatusBtn");
  const input = document.getElementById("bookingId");
  const box = document.getElementById("statusResult");

  btn.addEventListener("click", async () => {
    const bookingId = input.value.trim();

    if (!bookingId) {
      box.style.display = "block";
      box.innerHTML = "❌ Please enter a Booking ID";
      return;
    }

    box.style.display = "block";
    box.innerHTML = "🔍 Checking booking status...";

    try {
      const res = await fetch(
        `${API_BASE}/api/bookings/status/${bookingId}`
      );
      const data = await res.json();

      if (!data.success) {
        box.innerHTML = "❌ Booking not found";
        return;
      }

      const status = data.status.toUpperCase();

      box.innerHTML = `
        <div class="status-card success">
          <h2>Status: ${status}</h2>
          <p class="next-step">📩 Our team will contact you shortly.</p>
        </div>
      `;

    } catch (err) {
      console.error(err);
      box.innerHTML = "⚠️ Server error. Please try again later.";
    }
  });
});