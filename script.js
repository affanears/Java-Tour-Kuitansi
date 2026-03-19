// ============================
// DATA USER (ADMIN CONTROL)
// ============================
const users = [
  { username: "admin", password: "12345" },
  { username: "staff", password: "java123" },
  { username: "affan", password: "AffanCakep" }
];

// ============================
// URL GOOGLE SPREADSHEET
// ============================
const scriptURL = "https://script.google.com/macros/s/AKfycbyLuGfldklKMuispvavPRhEel2gH1llAmP3lzmfD0WLCEoXYhjIGuljn0YPSaglO5ws/exec";

// ============================
// LOGIN FUNCTION
// ============================
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  const validUser = users.find(
    user => user.username === username && user.password === password
  );

  if (validUser) {
    document.getElementById("loadingScreen").style.display = "flex";

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loginTime", Date.now());

    setTimeout(() => {
      document.getElementById("loadingScreen").style.display = "none";
      document.getElementById("loginPage").style.display = "none";
      document.querySelector(".container").style.display = "block";
    }, 1500);

  } else {
    errorMsg.innerText = "Username atau password salah!";
  }
}

// ============================
// LOGOUT
// ============================
function logout() {
  if (!confirm("Yakin ingin logout?")) return;

  localStorage.clear();

  document.getElementById("loginPage").style.display = "flex";
  document.querySelector(".container").style.display = "none";
}

// ============================
// AUTO LOGIN
// ============================
window.addEventListener("load", () => {
  if (localStorage.getItem("isLoggedIn") === "true") {
    document.getElementById("loginPage").style.display = "none";
    document.querySelector(".container").style.display = "block";
  }
});

// ============================
// DATA PERUSAHAAN
// ============================
const perusahaan = {
  nama: "CV. JAVA TOUR INDONESIA",
  alamat: "Jl. Ir Soekarno No.12 ,Beji,Kota Batu – Malang, Jawa Timur,65326",
  telepon: "082230425353 / 082230019691"
};

const penerimaTetap = "Doni";
const kotaTetap = "Malang";

// ============================
// FORMAT NOMINAL
// ============================
const nominalInput = document.getElementById("nominal");

nominalInput.addEventListener("input", function () {
  let angka = this.value.replace(/[^0-9]/g, "");
  this.value = angka ? Number(angka).toLocaleString("id-ID") : "";
});

// ============================
// TERBILANG
// ============================
function terbilang(nilai) {
  const huruf = [
    "", "satu", "dua", "tiga", "empat", "lima",
    "enam", "tujuh", "delapan", "sembilan",
    "sepuluh", "sebelas"
  ];

  nilai = parseInt(nilai);

  if (nilai < 12) return huruf[nilai];
  if (nilai < 20) return terbilang(nilai - 10) + " belas";
  if (nilai < 100)
    return terbilang(Math.floor(nilai / 10)) + " puluh " + terbilang(nilai % 10);
  if (nilai < 200) return "seratus " + terbilang(nilai - 100);
  if (nilai < 1000)
    return terbilang(Math.floor(nilai / 100)) + " ratus " + terbilang(nilai % 100);
  if (nilai < 2000) return "seribu " + terbilang(nilai - 1000);
  if (nilai < 1000000)
    return terbilang(Math.floor(nilai / 1000)) + " ribu " + terbilang(nilai % 1000);
  if (nilai < 1000000000)
    return terbilang(Math.floor(nilai / 1000000)) + " juta " + terbilang(nilai % 1000000);

  return "";
}

// ============================
// GENERATE + KIRIM SHEET
// ============================
function generate() {
  const terima = document.getElementById("terima").value.trim();
  const nominal = document.getElementById("nominal").value.replace(/\./g, "");
  const deskripsi = document.getElementById("deskripsi").value.trim();

  if (!terima || !nominal || !deskripsi) {
    alert("Isi semua data!");
    return;
  }

  const nomor = "KW/" + Math.floor(Math.random() * 900000 + 100000);
  const tanggal = new Date().toLocaleString("id-ID");

  // kirim ke spreadsheet
  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify({
      nomor,
      terima,
      nominal: Number(nominal),
      deskripsi,
      tanggal
    })
  });

  let hasil = terbilang(nominal);
  hasil = hasil.charAt(0).toUpperCase() + hasil.slice(1) + " rupiah";

  document.getElementById("judulPreview").innerText = perusahaan.nama;
  document.getElementById("alamatPreview").innerText = perusahaan.alamat;
  document.getElementById("teleponPreview").innerText = perusahaan.telepon;

  document.getElementById("no").innerText = "No: " + nomor;
  document.getElementById("kTerima").innerText = terima;
  document.getElementById("kNominal").innerText = hasil;
  document.getElementById("kDeskripsi").innerText = deskripsi;

  document.getElementById("kJumlah").innerText =
    "Rp " + Number(nominal).toLocaleString("id-ID") + ",00";

  document.getElementById("kPenerima").innerText =
    "Penerima: " + penerimaTetap;

  document.getElementById("tanggal").innerText =
    kotaTetap + ", " + tanggal;

  document.getElementById("kuitansi").style.display = "block";
  document.querySelector(".downloadArea").style.display = "flex";
}

// ============================
// DOWNLOAD JPG (FIX BERSIH)
// ============================
function downloadJPG() {
  const kuitansi = document.querySelector("#kuitansi");

  document.body.classList.add("download-mode");

  html2canvas(kuitansi, {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true
  }).then(canvas => {

    document.body.classList.remove("download-mode");

    const link = document.createElement("a");
    link.download = "kuitansi.jpg";
    link.href = canvas.toDataURL("image/jpeg", 1.0);
    link.click();

    resetForm();
  });
}

// ============================
// DOWNLOAD PDF (FIX BERSIH)
// ============================
async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const kuitansi = document.querySelector("#kuitansi");

  document.body.classList.add("download-mode");

  const canvas = await html2canvas(kuitansi, {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true
  });

  document.body.classList.remove("download-mode");

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("landscape", "px", [canvas.width, canvas.height]);
  pdf.addImage(imgData, "PNG", 0, 0);

  pdf.save("kuitansi.pdf");

  resetForm();
}

// ============================
// RESET FORM
// ============================
function resetForm() {
  document.getElementById("kuitansi").style.display = "none";
  document.querySelector(".downloadArea").style.display = "none";

  document.querySelectorAll("input, textarea").forEach(el => el.value = "");
}

// ============================
// BACKGROUND SLIDER
// ============================
const backgrounds = ["bg1.jpg", "bg2.jpg", "bg3.jpg", "bg4.jpg"];
const slides = document.querySelectorAll(".bg-slide");

let current = 0;

slides[0].style.backgroundImage = `url('${backgrounds[0]}')`;
slides[1].style.backgroundImage = `url('${backgrounds[1]}')`;

function changeBackgroundSmooth() {
  const next = (current + 1) % backgrounds.length;

  slides[next % 2].style.backgroundImage = `url('${backgrounds[next]}')`;

  slides[current % 2].classList.remove("active");
  slides[next % 2].classList.add("active");

  current = next;
}

setInterval(changeBackgroundSmooth, 7000);
slides[0].classList.add("active");

// ============================
// ENTER PINDAH INPUT (FIX)
// ============================
const inputs = document.querySelectorAll("#generatorBox input, #generatorBox textarea");

inputs.forEach((input, index) => {
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();

      if (index + 1 < inputs.length) {
        inputs[index + 1].focus();
      } else {
        generate(); // terakhir langsung generate
      }
    }
  });
});