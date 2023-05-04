import './styles/style.css';

const canvas = document.querySelector('.maingrid');
const ctx = canvas.getContext('2d');

let images = [];

async function loadGrid() {
  try {
    const response = await fetch('http://localhost:3000/give');
    const data = await response.json();
    images = data.files;

    drawImages(images);
  } catch (error) {
    console.error(error);
  }
}

function drawImage(index, images) {
  const canvasItemWidth = canvas.width / images.length;
  console.log('drawImage', index);
  const image = images[index];

  let myImg = new Image();
  myImg.addEventListener('load', () => {
    let realWidth = myImg.naturalWidth;
    let realHeight = myImg.naturalHeight;

    let resizedWidth = (realWidth / realHeight) * canvas.height;
    let overflowWidth = (realWidth - resizedWidth) / 2;
    const imageItemWidth = (realWidth - overflowWidth * 2) / images.length;

    ctx.drawImage(
      myImg,
      overflowWidth + imageItemWidth * index,
      0,
      imageItemWidth,
      realHeight,
      canvasItemWidth * index,
      0,
      canvasItemWidth,
      canvas.clientHeight,
    );
    myImg.remove();

    if (index < images.length - 1) {
      drawImage(index + 1, images);
    }
  });

  myImg.src = image;
}

function drawImages(images) {
  console.log('drawImages');
  drawImage(0, images);
}
loadGrid();

setInterval(() => {
  loadGrid();
}, 10000);
