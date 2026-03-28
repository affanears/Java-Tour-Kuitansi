// ============================
// 🔥 SUPABASE CONFIG
// ============================
const SUPABASE_URL = "https://fduhqhzndfwxqqmsndxb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkdWhxaHpuZGZ3eHFxbXNuZHhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2OTMxMjIsImV4cCI6MjA5MDI2OTEyMn0.3huJorv2XC_s0M3AQv4SVoiz6uolRayaXIMJSIV3o2g";


// ============================
// KONEKSI GOOGLE SPREADSHEET
// ============================
const SPREADSHEET_URL = "https://script.google.com/macros/s/AKfycbwi685YRE_3mOa3lYlScN1q6W6GdsNq4_2PzQrhGnwp-3SYWTiT93RvyxWrKgKxrEaefQ/exec";


// ============================
// DATA USER (LOGIN ADMIN)
// ============================
const users = [
  { username: "JavaTour", password: "12345" },
  { username: "affan", password: "AffanCakep" },
  { username: "user", password: "21062011" }
];


// ============================
// LOGIN
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
    document.getElementById("loadingText").innerText =
      "Selamat datang, " + username + "...";

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", username);
    localStorage.setItem("loginTime", Date.now());

    setTimeout(() => {
      document.getElementById("loadingScreen").style.display = "none";
      document.getElementById("loginPage").style.display = "none";
      document.querySelector(".container").style.display = "block";
    }, 2000);

  } else {
    errorMsg.innerText = "Username atau password salah!";
  }
}


// ============================
// NAVIGASI ENTER LOGIN
// ============================
window.addEventListener("load", () => {
  const loginInputs = document.querySelectorAll("#loginPage input");

  loginInputs.forEach((input, index) => {
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();

        if (index === 0) {
          loginInputs[1].focus();
        } else {
          login();
        }
      }
    });
  });

  const usernameInput = document.getElementById("username");
  if (usernameInput) usernameInput.focus();
});


// ============================
// LOGOUT
// ============================
function logout() {
  if (!confirm("Yakin ingin logout?")) return;

  localStorage.clear();

  document.getElementById("loginPage").style.display = "flex";
  document.querySelector(".container").style.display = "none";

  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}


// ============================
// SESSION LOGIN
// ============================
const MAX_TIME = 24 * 60 * 60 * 1000;

function checkSession() {
  const loginTime = localStorage.getItem("loginTime");
  if (!loginTime) return;

  if (Date.now() - loginTime > MAX_TIME) {
    localStorage.clear();
    alert("Session habis, silakan login kembali.");
    location.reload();
  }
}

window.addEventListener("load", () => {
  checkSession();

  if (localStorage.getItem("isLoggedIn") === "true") {
    document.getElementById("loginPage").style.display = "none";
    document.querySelector(".container").style.display = "block";
  }
});

setInterval(checkSession, 60000);


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
// 🔥 GENERATE NOMOR (SUPABASE)
// ============================
async function generateNomorKuitansi() {
  const now = new Date();

  const tahun = now.getFullYear().toString().slice(-2);
  const bulan = String(now.getMonth() + 1).padStart(2, "0");

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_next_kuitansi_number`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        p_tahun: tahun,
        p_bulan: bulan
      })
    });

    const nomorUrut = await response.json();

    let nomorFormat = nomorUrut < 10
      ? "0" + nomorUrut
      : nomorUrut.toString();

    return `JT/${tahun}${bulan}${nomorFormat}`;

  } catch (err) {
    alert("Gagal ambil nomor dari server!");
    console.error(err);
    return "ERROR";
  }
}


// ============================
// NAVIGASI INPUT FORM (ENTER)
// ============================
window.addEventListener("load", () => {
  const inputs = document.querySelectorAll("#generatorBox input, #generatorBox textarea");

  inputs.forEach((input, index) => {
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();

        if (index + 1 < inputs.length) {
          inputs[index + 1].focus();
        } else {
          generate();
        }
      }
    });
  });
});


// ============================
// FORMAT NOMINAL
// ============================
window.addEventListener("load", () => {
  const nominalInput = document.getElementById("nominal");

  if (nominalInput) {
    nominalInput.addEventListener("input", function () {
      let angka = this.value.replace(/[^0-9]/g, "");
      this.value = angka ? Number(angka).toLocaleString("id-ID") : "";
    });
  }
});


// ============================
// COUNTER DESKRIPSI
// ============================
window.addEventListener("load", () => {
  const deskripsiInput = document.getElementById("deskripsi");
  const counter = document.getElementById("counter");

  if (deskripsiInput) {
    deskripsiInput.addEventListener("input", () => {
      counter.textContent = deskripsiInput.value.length + " / 300";
    });
  }
});


// ============================
// TERBILANG
// ============================
function terbilang(nilai) {
  const huruf = [
    "", "satu", "dua", "tiga", "empat", "lima",
    "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"
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
// KIRIM KE GOOGLE SHEET
// ============================
function kirimKeSpreadsheet(data) {
  fetch(SPREADSHEET_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}


// ============================
// 🔥 GENERATE KUITANSI
// ============================
async function generate() {
  const terima = document.getElementById("terima").value.trim();
  const nominal = document.getElementById("nominal").value.replace(/\./g, "");
  const deskripsi = document.getElementById("deskripsi").value.trim();

  if (!terima || !nominal || !deskripsi) {
    alert("Silakan isi semua form!");
    return;
  }

  const nomor = await generateNomorKuitansi();
  if (nomor === "ERROR") return;

  const tanggal = new Date().toLocaleDateString("id-ID");

  let hasilTerbilang = terbilang(nominal);
  hasilTerbilang =
    hasilTerbilang.charAt(0).toUpperCase() +
    hasilTerbilang.slice(1) + " rupiah";

  document.getElementById("judulPreview").innerText = perusahaan.nama;
  document.getElementById("alamatPreview").innerText = perusahaan.alamat;
  document.getElementById("teleponPreview").innerText = perusahaan.telepon;

  document.getElementById("no").innerText = "No: " + nomor;
  document.getElementById("kTerima").innerText = terima;
  document.getElementById("kNominal").innerText = hasilTerbilang;
  document.getElementById("kDeskripsi").innerText = deskripsi;

  document.getElementById("kJumlah").innerText =
    "Rp " + Number(nominal).toLocaleString("id-ID") + ",00";

  document.getElementById("kPenerima").innerText = "Penerima: " + penerimaTetap;
  document.getElementById("tanggal").innerText =
    kotaTetap + ", " + tanggal;

  document.getElementById("kuitansi").style.display = "block";
  document.querySelector(".downloadArea").style.display = "flex";

  kirimKeSpreadsheet({
    no: nomor,
    terima,
    nominal: Number(nominal),
    deskripsi,
    tanggal
  });
}


// ============================
// 🔥 RESET FORM
// ============================
function resetForm() {
  document.getElementById("terima").value = "";
  document.getElementById("nominal").value = "";
  document.getElementById("deskripsi").value = "";

  document.getElementById("kuitansi").style.display = "none";
  document.querySelector(".downloadArea").style.display = "none";

  const counter = document.getElementById("counter");
  if (counter) counter.textContent = "0 / 300";

  document.getElementById("terima").focus();
}


// ============================
// DOWNLOAD JPG
// ============================
function downloadJPG() {
  const kuitansi = document.querySelector("#kuitansi");

  html2canvas(kuitansi, {
    backgroundColor: "#ffffff",
    scale: 2
  }).then(canvas => {
    const link = document.createElement("a");
    link.download = "kuitansi.jpg";
    link.href = canvas.toDataURL("image/jpeg", 1.0);
    link.click();

    setTimeout(resetForm, 800);
  });
}


// ============================
// DOWNLOAD PDF
// ============================
async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const kuitansi = document.querySelector("#kuitansi");

  const canvas = await html2canvas(kuitansi, {
    backgroundColor: "#ffffff",
    scale: 2
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("landscape", "px", [canvas.width, canvas.height]);
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save("kuitansi.pdf");

  setTimeout(resetForm, 800);
}