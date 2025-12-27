document.addEventListener("DOMContentLoaded", () => {

  /* =====================
     CONFIG
  ===================== */
  const API_BASE = "https://crypto-pro-1.onrender.com";

  /* =====================
     STATE
  ===================== */
  let amount = 0;
  let userData = {};

  /* =====================
     ELEMENTS
  ===================== */
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const step3 = document.getElementById("step3");

  const continueBtn = document.getElementById("toStep2");
  const form = document.getElementById("bookingForm");

  const backBtn = document.getElementById("backToStep2");
  const finalConfirmBtn = document.getElementById("finalConfirm");

  const bookingIdBox = document.querySelector(".booking-id");

  const amountInput = document.getElementById("purchaseAmount");
  const presetButtons = document.querySelectorAll(".amount-presets button");

  /* =====================
     PRESET BUTTONS
  ===================== */
  presetButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      amountInput.value = btn.dataset.value;
    });
  });

  /* =====================
     GO TO STEP 2
  ===================== */
  continueBtn.addEventListener("click", () => {
    amount = Number(amountInput.value);

    if (!amount || amount < 200 || amount > 15000) {
      alert("Please enter an amount between $200 and $15,000");
      return;
    }

    step1.classList.remove("active");
    step2.classList.add("active");
  });

  /* =====================
     FORM SUBMIT → STEP 3
  ===================== */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    // ✅ TELEGRAM
    const telegram = document.getElementById("telegram").value.trim();

    if (!name || !email || !phone || !telegram) {
      alert("Please fill all details including Telegram ID");
      return;
    }

    userData = { name, email, phone, telegram };

    document.getElementById("confirmPackage").innerText = "Custom Amount";
    document.getElementById("confirmPrice").innerText = `$${amount}`;
    document.getElementById("confirmName").innerText = name;
    document.getElementById("confirmEmail").innerText = email;
    document.getElementById("confirmPhone").innerText = phone;

    // ✅ SHOW TELEGRAM IN STEP 3
    const telegramEl = document.getElementById("confirmTelegram");
    if (telegramEl) telegramEl.innerText = telegram;

    if (bookingIdBox) bookingIdBox.style.display = "none";

    step2.classList.remove("active");
    step3.classList.add("active");
  });

  /* =====================
     BACK TO STEP 2
  ===================== */
  backBtn.addEventListener("click", () => {
    step3.classList.remove("active");
    step2.classList.add("active");
  });

  /* =====================
     FINAL CONFIRM → API CALL
  ===================== */
  finalConfirmBtn.addEventListener("click", async () => {

    finalConfirmBtn.disabled = true;
    finalConfirmBtn.innerText = "Booking...";

    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          telegram: userData.telegram, // ✅ TELEGRAM SENT
          packageName: "Custom",
          amount
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Booking failed");
      }

      if (bookingIdBox) bookingIdBox.style.display = "flex";
      document.getElementById("confirmBookingId").innerText =
        data.bookingId || "Generated";

      finalConfirmBtn.innerText = "Booked ✓";

    } catch (error) {
      console.error("Booking Error:", error);
      alert(error.message || "Server error. Please try again.");

      finalConfirmBtn.disabled = false;
      finalConfirmBtn.innerText = "Confirm Booking ✓";
    }
  });

});
