import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore, collection, query, orderBy, onSnapshot, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const depositsRef = collection(db, "deposits");

const loginCard = document.getElementById("loginCard");
const adminPanel = document.getElementById("adminPanel");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const adminTable = document.getElementById("adminTable");
const adminSearch = document.getElementById("adminSearch");
const adminTotal = document.getElementById("adminTotal");
const adminCount = document.getElementById("adminCount");
const adminEmail = document.getElementById("adminEmail");
const logoutBtn = document.getElementById("logoutBtn");

const rupiah = n => new Intl.NumberFormat("id-ID", {style:"currency", currency:"IDR", maximumFractionDigits:0}).format(n);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

let deposits = [];

loginForm.addEventListener("submit", async e => {
  e.preventDefault();
  loginMessage.textContent = "";
  try {
    await signInWithEmailAndPassword(
      auth,
      document.getElementById("email").value.trim(),
      document.getElementById("password").value
    );
  } catch (err) {
    console.error(err);
    loginMessage.textContent = "Login gagal. Email atau password salah.";
    loginMessage.style.color = "#dc2626";
  }
});

logoutBtn.addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, user => {
  if (user) {
    loginCard.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    adminEmail.textContent = user.email || "";
    startData();
  } else {
    loginCard.classList.remove("hidden");
    adminPanel.classList.add("hidden");
  }
});

function render() {
  const term = adminSearch.value.trim().toLowerCase();
  const filtered = deposits.filter(d => d.nama.toLowerCase().includes(term));
  adminTotal.textContent = rupiah(deposits.reduce((s,d) => s + Number(d.nominal || 0), 0));
  adminCount.textContent = deposits.length;

  if (!filtered.length) {
    adminTable.innerHTML = '<tr><td colspan="5" class="empty">Belum ada data.</td></tr>';
    return;
  }

  adminTable.innerHTML = filtered.map(d => `
    <tr>
      <td>${esc(d.tanggal)}</td>
      <td>${esc(d.nama)}</td>
      <td><strong>${rupiah(d.nominal)}</strong></td>
      <td>${esc(d.keterangan || "-")}</td>
      <td><button class="delete" data-id="${esc(d.id)}">Hapus</button></td>
    </tr>`).join("");

  document.querySelectorAll(".delete").forEach(btn => {
    btn.addEventListener("click", async () => {
      if (!confirm("Hapus data setoran ini?")) return;
      try {
        await deleteDoc(doc(db, "deposits", btn.dataset.id));
      } catch (err) {
        alert("Gagal menghapus data.");
        console.error(err);
      }
    });
  });
}

adminSearch.addEventListener("input", render);

function startData() {
  const q = query(depositsRef, orderBy("tanggal", "desc"));
  onSnapshot(q, snap => {
    deposits = snap.docs.map(doc => ({id:doc.id, ...doc.data()}));
    render();
  }, err => {
    console.error(err);
    adminTable.innerHTML = '<tr><td colspan="5" class="empty">Tidak dapat membaca database.</td></tr>';
  });
}
