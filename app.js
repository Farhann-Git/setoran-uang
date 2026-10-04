import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const depositsRef = collection(db, "deposits");

const form = document.getElementById("depositForm");
const table = document.getElementById("depositTable");
const searchInput = document.getElementById("searchInput");
const totalAmount = document.getElementById("totalAmount");
const totalCount = document.getElementById("totalCount");
const message = document.getElementById("formMessage");
const submitBtn = document.getElementById("submitBtn");

const rupiah = n => new Intl.NumberFormat("id-ID", {style:"currency", currency:"IDR", maximumFractionDigits:0}).format(n);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

document.getElementById("tanggal").value = new Date().toISOString().slice(0,10);

let deposits = [];

form.addEventListener("submit", async e => {
  e.preventDefault();
  message.textContent = "";
  submitBtn.disabled = true;
  submitBtn.textContent = "Menyimpan...";

  try {
    const nama = document.getElementById("nama").value.trim();
    const nominal = Number(document.getElementById("nominal").value);
    const tanggal = document.getElementById("tanggal").value;
    const keterangan = document.getElementById("keterangan").value.trim();

    if (!nama || !tanggal || !Number.isFinite(nominal) || nominal < 100) {
      throw new Error("Data belum lengkap atau nominal tidak valid.");
    }

    await addDoc(depositsRef, {
      nama, nominal, tanggal, keterangan,
      createdAt: serverTimestamp()
    });

    form.reset();
    document.getElementById("tanggal").value = new Date().toISOString().slice(0,10);
    message.textContent = "Setoran berhasil disimpan.";
    message.style.color = "#15803d";
  } catch (err) {
    console.error(err);
    message.textContent = "Gagal menyimpan. Periksa konfigurasi Firebase dan koneksi internet.";
    message.style.color = "#dc2626";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Simpan Setoran";
  }
});

function render() {
  const term = searchInput.value.trim().toLowerCase();
  const filtered = deposits.filter(d => d.nama.toLowerCase().includes(term));
  const total = deposits.reduce((sum, d) => sum + Number(d.nominal || 0), 0);
  totalAmount.textContent = rupiah(total);
  totalCount.textContent = deposits.length;

  if (!filtered.length) {
    table.innerHTML = '<tr><td colspan="4" class="empty">Belum ada data setoran.</td></tr>';
    return;
  }
  table.innerHTML = filtered.map(d => `
    <tr>
      <td>${esc(d.tanggal)}</td>
      <td>${esc(d.nama)}</td>
      <td><strong>${rupiah(d.nominal)}</strong></td>
      <td>${esc(d.keterangan || "-")}</td>
    </tr>`).join("");
}
searchInput.addEventListener("input", render);

const q = query(depositsRef, orderBy("tanggal", "desc"));
onSnapshot(q, snap => {
  deposits = snap.docs.map(doc => ({id:doc.id, ...doc.data()}));
  render();
}, err => {
  console.error(err);
  table.innerHTML = '<tr><td colspan="4" class="empty">Database belum tersambung. Periksa Firebase.</td></tr>';
});
