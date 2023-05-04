import './styles/style.css';

function getQr(params) {
  const qrCodeImg = document.getElementById('qrCodeImg');
  fetch('http://localhost:4000/qrcode')
    .then((res) => res.text())
    .then((qrCodeDataURL) => {
      qrCodeImg.src = qrCodeDataURL;
    })
    .catch((err) => console.error('error:' + err));
}

setInterval(() => {
  getQr();
}, 1000);

let mijnNummer = 'Zie NFT';
document.querySelector('#nummer').textContent = 'Nummer: ' + mijnNummer;

let mijnDatum = new Date().toDateString();
document.querySelector('#datum').textContent = 'Datum: ' + mijnDatum;

let mijnTijd = new Date().toLocaleTimeString();
document.querySelector('#tijd').textContent = 'Tijd: ' + mijnTijd;

let mijnAantalImages = mijnNummer;
document.querySelector('#aantal').textContent =
  'Aantal afbeeldingen: ' + mijnAantalImages;

let mijnPrijs = '0,5 ETH';
document.querySelector('#prijs').textContent = 'Gemiddelde prijs: ' + mijnPrijs;
