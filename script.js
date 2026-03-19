// ============================
// KONFIGURASI PERUSAHAAN
// ============================
const perusahaan = {
  nama: "CV. JAVA TOUR INDONESIA",
  alamat: "Jl. Ir Soekarno No.12 ,Beji,Kota Batu – Malang, Jawa Timur,65326",
  telepon: "082230425353 / 082230019691"
};

// ============================
// DATA TETAP
// ============================
const penerimaTetap = "Doni";
const kotaTetap = "Malang";

// ============================
// URL GOOGLE APPS SCRIPT
// ============================
const scriptURL = "https://script.google.com/macros/s/AKfycbzvaW8gullfpcFxEsjSJXJAL5wS2fZP26DLdXf5--jnrbji_k8pqGsge50Dnlo7rYc0/exec";

// ============================
// PINDAH INPUT SAAT ENTER
// ============================
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

// ============================
// COUNTER DESKRIPSI
// ============================
const deskripsiInput = document.getElementById("deskripsi");
const counter = document.getElementById("counter");

deskripsiInput.addEventListener("input", () => {
  counter.textContent = deskripsiInput.value.length + " / 120";
});

// ============================
// FORMAT NOMINAL
// ============================
const nominalInput = document.getElementById("nominal");

nominalInput.addEventListener("input", function () {
  let angka = this.value.replace(/[^0-9]/g, "");
  this.value = angka ? Number(angka).toLocaleString("id-ID") : "";
});

// ============================
// FUNGSI TERBILANG
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
// GENERATE KUITANSI
// ============================
function generate() {
  const terima = document.getElementById("terima").value.trim();
  const nominal = document.getElementById("nominal").value.replace(/\./g, "");
  const deskripsi = document.getElementById("deskripsi").value.trim();

  if (!terima || !nominal || !deskripsi) {
    alert("Silakan isi semua form!");
    return;
  }

  const nomor = "KW/" + Math.floor(Math.random() * 900000 + 100000);
  const tanggal = new Date().toLocaleDateString("id-ID");

  const dataToSheet = {
    nomor: nomor,
    terima: terima,
    nominal: nominal,
    deskripsi: deskripsi
  };

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(dataToSheet)
  }).catch(err => console.error(err));

  let hasilTerbilang = terbilang(nominal).replace(/\s+/g, " ").trim();
  hasilTerbilang =
    hasilTerbilang.charAt(0).toUpperCase() +
    hasilTerbilang.slice(1) +
    " rupiah";

  document.getElementById("judulPreview").innerText = perusahaan.nama;
  document.getElementById("alamatPreview").innerText = perusahaan.alamat;
  document.getElementById("teleponPreview").innerText = perusahaan.telepon;

  document.getElementById("no").innerText = "No: " + nomor;
  document.getElementById("kTerima").innerText = terima;
  document.getElementById("kNominal").innerText = hasilTerbilang;
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
// DOWNLOAD JPG
// ============================
function downloadJPG() {
  html2canvas(document.querySelector("#kuitansi")).then(canvas => {
    const link = document.createElement("a");
    link.download = "kuitansi.jpg";
    link.href = canvas.toDataURL("image/jpeg");
    link.click();
    resetForm();
  });
}

// ============================
// DOWNLOAD PDF
// ============================
async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const canvas = await html2canvas(document.querySelector("#kuitansi"));
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("landscape", "px", [canvas.width, canvas.height]);
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
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
  counter.textContent = "0 / 120";
}