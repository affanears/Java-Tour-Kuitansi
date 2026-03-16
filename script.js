// ======== KONFIGURASI PERUSAHAAN ==========
const perusahaan = {
  nama: "CV. JAVA TOUR INDONESIA",
  alamat: "Jl. Ir Soekarno No.12 ,Beji,Kota Batu – Malang, Jawa Timur,65326",
  telepon: "082230425353 / 082230019691"
};

// ======== COUNTER DESKRIPSI ==========
const deskripsiInput = document.getElementById("deskripsi");
const counter = document.getElementById("counter");
deskripsiInput.addEventListener("input", () => {
  counter.textContent = deskripsiInput.value.length + " / 120";
});

// ======== FORMAT NOMINAL OTOMATIS ==========
const nominalInput = document.getElementById("nominal");
nominalInput.addEventListener("input", function(){
  let angka = this.value.replace(/[^0-9]/g,"");
  this.value = angka ? Number(angka).toLocaleString("id-ID") : "";
});

// ======== GENERATE KUITANSI ==========
function generate(){
  const terima = document.getElementById("terima").value.trim();
  const nominal = document.getElementById("nominal").value.replace(/\./g,"");
  const deskripsi = document.getElementById("deskripsi").value.trim();
  const penerima = document.getElementById("penerima").value.trim();
  const kota = document.getElementById("kota").value.trim();

  if(!terima || !nominal || !deskripsi || !penerima || !kota){
    alert("Silakan isi semua form!");
    return;
  }

  const nomor = "KW/" + Math.floor(Math.random()*900000 + 100000);
  const tanggal = new Date().toLocaleDateString("id-ID");

  // Tampilkan data
  document.getElementById("judulPreview").innerText = perusahaan.nama;
  document.getElementById("alamatPreview").innerText = perusahaan.alamat;
  document.getElementById("teleponPreview").innerText = perusahaan.telepon;
  document.getElementById("no").innerText = "No: " + nomor;
  document.getElementById("kTerima").innerText = terima;
  document.getElementById("kNominal").innerText = new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR"}).format(nominal);
  document.getElementById("kDeskripsi").innerText = deskripsi;
  document.getElementById("kJumlah").innerText = "Rp " + Number(nominal).toLocaleString("id-ID");
  document.getElementById("kPenerima").innerText = penerima;
  document.getElementById("tanggal").innerText = kota + ", " + tanggal;

  // Preview logo
  const logo = document.getElementById("logo").files[0];
  if(logo){
    const reader = new FileReader();
    reader.onload = e => document.getElementById("logoPreview").src = e.target.result;
    reader.readAsDataURL(logo);
  }

  // Preview tanda tangan
  const ttd = document.getElementById("ttd").files[0];
  if(ttd){
    const reader2 = new FileReader();
    reader2.onload = e => document.getElementById("ttdPreview").src = e.target.result;
    reader2.readAsDataURL(ttd);
  }

  document.getElementById("kuitansi").style.display="block";
  document.querySelector(".downloadArea").style.display="flex";
}

// ======== DOWNLOAD JPG ==========
function downloadJPG(){
  html2canvas(document.querySelector("#kuitansi")).then(canvas=>{
    const link = document.createElement("a");
    link.download="kuitansi.jpg";
    link.href = canvas.toDataURL("image/jpeg");
    link.click();
    resetForm();
  });
}

// ======== DOWNLOAD PDF ==========
async function downloadPDF(){
  const { jsPDF } = window.jspdf;
  const canvas = await html2canvas(document.querySelector("#kuitansi"));
  const img = canvas.toDataURL("image/png");
  const pdf = new jsPDF("landscape","px",[canvas.width,canvas.height]);
  pdf.addImage(img,"PNG",0,0,canvas.width,canvas.height);
  pdf.save("kuitansi.pdf");
  resetForm();
}

// ======== RESET FORM ==========
function resetForm(){
  document.getElementById("kuitansi").style.display="none";
  document.querySelector(".downloadArea").style.display="none";
  document.querySelectorAll("input,textarea").forEach(el=>el.value="");
  counter.textContent="0 / 120";
  document.getElementById("logo").value="";
  document.getElementById("ttd").value="";
}