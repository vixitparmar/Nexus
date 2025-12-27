console.log("✅ adminDashboard.js loaded");

/* =========================
   CONFIG
========================= */
const API_BASE = ""; // works for both local & Render
const adminToken = localStorage.getItem("adminToken");

if (!adminToken) {
  window.location.replace("admin-login.html");
}

/* =========================
   GLOBALS
========================= */
const table = document.querySelector("#bookingTable tbody");
let allBookings = [];

/* =========================
   SKELETON LOADING
========================= */
function showSkeleton() {
  table.innerHTML = `
    <tr>
      <td colspan="8" style="padding:30px; opacity:0.5; text-align:center">
        Loading bookings...
      </td>
    </tr>
  `;
}

/* =========================
   LOAD BOOKINGS (ADMIN)
========================= */
async function loadBookings() {
  console.log("🚀 loadBookings called");
  showSkeleton();

  try {
    const res = await fetch(`${API_BASE}/api/bookings`, {
      headers: {
        Authorization: "Bearer " + adminToken
      }
    });

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("adminToken");
      window.location.href = "admin-login.html";
      return;
    }

    const data = await res.json();
    console.log("📦 bookings from API:", data);

    allBookings = data;
    renderBookings(allBookings);

  } catch (err) {
    console.error("❌ Load bookings error:", err);
    renderBookings([]);
  }
}

/* =========================
   RENDER BOOKINGS
========================= */
function renderBookings(bookings) {
  table.innerHTML = "";

  if (!bookings || bookings.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="8" style="padding:30px; opacity:0.5; text-align:center">
          No bookings available
        </td>
      </tr>
    `;
    return;
  }

  bookings.forEach(b => {
    const row = document.createElement("tr");

    const telegramLink = b.telegram
      ? `<a href="https://t.me/${b.telegram.replace("@", "")}" target="_blank">
           ${b.telegram}
         </a>`
      : "-";

    row.innerHTML = `
      <td>${b.bookingId}</td>
      <td>${b.name}</td>
      <td>${b.email}</td>
      <td>${b.phone}</td>

      <!-- ✅ TELEGRAM -->
      <td>${telegramLink}</td>

      <td>
        <span class="status ${b.status}">${b.status}</span>
      </td>
      <td>${new Date(b.createdAt).toLocaleDateString()}</td>
      <td>
        <select class="action" onchange="updateStatus('${b._id}', this.value)">
          <option value="pending" ${b.status === "pending" ? "selected" : ""}>Pending</option>
          <option value="approved" ${b.status === "approved" ? "selected" : ""}>Approved</option>
          <option value="rejected" ${b.status === "rejected" ? "selected" : ""}>Rejected</option>
        </select>
      </td>
    `;

    table.appendChild(row);
  });
}

/* =========================
   UPDATE STATUS (ADMIN)
========================= */
async function updateStatus(id, status) {
  try {
    const res = await fetch(`${API_BASE}/api/bookings/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + adminToken
      },
      body: JSON.stringify({ status })
    });

    if (!res.ok) {
      console.error("❌ Failed to update status");
      return;
    }

    allBookings = allBookings.map(b =>
      b._id === id ? { ...b, status } : b
    );

    applyFilters();

  } catch (err) {
    console.error("❌ Update status error:", err);
  }
}

/* =========================
   FILTERS
========================= */
function applyFilters() {
  const searchInput = document.getElementById("searchInput");
  const statusSelect = document.getElementById("statusFilter");

  const search = searchInput ? searchInput.value.toLowerCase() : "";
  const status = statusSelect ? statusSelect.value : "all";

  let filtered = allBookings.filter(b =>
    b.bookingId.toLowerCase().includes(search) ||
    b.name.toLowerCase().includes(search) ||
    b.email.toLowerCase().includes(search) ||
    (b.telegram && b.telegram.toLowerCase().includes(search))
  );

  if (status !== "all") {
    filtered = filtered.filter(b => b.status === status);
  }

  renderBookings(filtered);
}

/* =========================
   EXPORT CSV
========================= */
function exportCSV() {
  if (!allBookings.length) return;

  const headers = [
    "Booking ID",
    "Name",
    "Email",
    "Phone",
    "Telegram",
    "Status",
    "Created"
  ];

  const rows = allBookings.map(b => [
    b.bookingId,
    b.name,
    b.email,
    b.phone,
    b.telegram || "",
    b.status,
    new Date(b.createdAt).toLocaleDateString()
  ]);

  let csv = headers.join(",") + "\n";
  rows.forEach(r => csv += r.join(",") + "\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "bookings.csv";
  a.click();

  URL.revokeObjectURL(url);
}

/* =========================
   LOGOUT
========================= */
function logout() {
  console.log("🚪 Logging out...");
  localStorage.removeItem("adminToken");
  window.location.replace("admin-login.html");
}

/* =========================
   INIT
========================= */
loadBookings();
setInterval(loadBookings, 30000);
