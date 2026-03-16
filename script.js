// DATA PERUSAHAAN OTOMATIS
const perusahaan = {

nama: "CV. JAVA TOUR INDONESIA",
alamat: "Jl. Ir Soekarno No.12 ,Beji,Kota Batu – Malang, Jawa Timur,65326",
telepon: "082230425353 / 082230019691"

}



/* ===============================
COUNTER DESKRIPSI
=============================== */

const deskripsiInput = document.getElementById("deskripsi")
const counter = document.getElementById("counter")

deskripsiInput.addEventListener("input", function(){

counter.textContent = deskripsiInput.value.length + " / 120"

})



/* ===============================
FORMAT NOMINAL
=============================== */

const nominalInput = document.getElementById("nominal")

nominalInput.addEventListener("input", function(){

let angka = this.value.replace(/[^0-9]/g,"")

if(angka === ""){
this.value = ""
return
}

this.value = Number(angka).toLocaleString("id-ID")

})



/* ===============================
GENERATE KUITANSI
=============================== */

function generate(){

let judul = perusahaan.nama
let alamat = perusahaan.alamat
let telepon = perusahaan.telepon

let terima = document.getElementById("terima").value.trim()

let nominal = document.getElementById("nominal").value.replace(/\./g,"")

let deskripsi = document.getElementById("deskripsi").value.trim()

let penerima = document.getElementById("penerima").value.trim()

let kota = document.getElementById("kota").value.trim()



if(
terima === "" ||
nominal === "" ||
deskripsi === "" ||
penerima === "" ||
kota === ""
){

alert("Silakan isi semua form!")

return

}



/* NOMOR KUITANSI */

let nomor = "KW/" + Math.floor(Math.random()*900000 + 100000)



/* TANGGAL */

let tanggal = new Date().toLocaleDateString("id-ID")



/* TAMPILKAN DATA */

document.getElementById("judulPreview").innerText = judul

document.getElementById("alamatPreview").innerText = alamat

document.getElementById("teleponPreview").innerText = telepon

document.getElementById("no").innerText = "No: " + nomor

document.getElementById("kTerima").innerText = terima



document.getElementById("kNominal").innerText =
new Intl.NumberFormat("id-ID",{
style:"currency",
currency:"IDR"
}).format(nominal)



document.getElementById("kDeskripsi").innerText = deskripsi

document.getElementById("kJumlah").innerText =
"Rp " + Number(nominal).toLocaleString("id-ID")



document.getElementById("kPenerima").innerText = penerima

document.getElementById("tanggal").innerText = kota + ", " + tanggal



/* PREVIEW LOGO */

let logo = document.getElementById("logo").files[0]

if(logo){

let reader = new FileReader()

reader.onload = function(e){

document.getElementById("logoPreview").src = e.target.result

}

reader.readAsDataURL(logo)

}



/* PREVIEW TTD */

let ttd = document.getElementById("ttd").files[0]

if(ttd){

let reader2 = new FileReader()

reader2.onload = function(e){

document.getElementById("ttdPreview").src = e.target.result

}

reader2.readAsDataURL(ttd)

}



/* TAMPILKAN KUITANSI */

document.getElementById("kuitansi").style.display="block"

document.querySelector(".downloadArea").style.display="flex"

}



/* DOWNLOAD JPG */

function downloadJPG(){

html2canvas(document.querySelector("#kuitansi")).then(canvas=>{

let link = document.createElement("a")

link.download = "kuitansi.jpg"

link.href = canvas.toDataURL("image/jpeg")

link.click()

resetForm()

})

}



/* DOWNLOAD PDF */

async function downloadPDF(){

const { jsPDF } = window.jspdf

let canvas = await html2canvas(document.querySelector("#kuitansi"))

let img = canvas.toDataURL("image/png")

let pdf = new jsPDF("landscape","px",[canvas.width,canvas.height])

pdf.addImage(img,"PNG",0,0,canvas.width,canvas.height)

pdf.save("kuitansi.pdf")

resetForm()

}



/* RESET FORM */

function resetForm(){

document.getElementById("kuitansi").style.display="none"

document.querySelector(".downloadArea").style.display="none"

document.querySelectorAll("input,textarea").forEach(el=>el.value="")

counter.textContent="0 / 120"

}