import './styles/style.css';

const video = document.getElementById('video');
const captureBtn = document.getElementById('capture-btn');
const timer = document.querySelector('#timer');

navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
    video.play();
  })
  .catch((error) => {
    console.error(error);
  });

var ws;

function wsConnect() {
  var wsUri = 'ws://192.168.100.1:1880/knop';
  console.log('connect', wsUri);
  ws = new WebSocket(wsUri);

  ws.onmessage = function (msg) {
    console.log(msg.data);
    if (msg.data === '1') {
      console.log('fdgdfgsd');
      let count = 3;
      timer.innerText = count;
      const countdown = setInterval(() => {
        count--;
        if (count > 0) {
          timer.innerText = count;
        } else {
          clearInterval(countdown);
          timer.innerText = '';
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          const videoAspectRatio = video.videoWidth / video.videoHeight;
          const canvasWidth = window.innerWidth;
          const canvasHeight = canvasWidth / videoAspectRatio;

          canvas.width = canvasWidth;
          canvas.height = canvasHeight;

          context.drawImage(video, 0, 0, canvasWidth, canvasHeight);

          fetch('http://localhost:3000/uploadimage', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: canvas.toDataURL('image/jpeg') }),
          }).catch((error) => {
            console.error(error);
            alert('Failed to upload image');
          });

          // take a screenshot
          fetch('http://localhost:3000/screenshots', {
            method: 'POST',
          });
        }
      }, 1000);
    }
  };

  ws.onopen = function () {
    // update the status with the connection status
    console.log('Connected');
  };

  ws.onclose = function () {
    // in case of lost connection tries to reconnect every 3 secs
    setTimeout(wsConnect, 3000);
  };

  ws.disconnect = function () {
    console.log('Disconnected');
  };
}

window.onload = wsConnect;

/*
captureBtn.addEventListener('click', () => {
  let count = 3;
  timer.innerText = count;
  const countdown = setInterval(() => {
    count--;
    if (count > 0) {
      timer.innerText = count;
    } else {
      clearInterval(countdown);
      timer.innerText = '';
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const videoAspectRatio = video.videoWidth / video.videoHeight;
      const canvasWidth = window.innerWidth;
      const canvasHeight = canvasWidth / videoAspectRatio;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      context.drawImage(video, 0, 0, canvasWidth, canvasHeight);

      fetch('http://localhost:3000/uploadimage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: canvas.toDataURL('image/jpeg') }),
      }).catch((error) => {
        console.error(error);
        alert('Failed to upload image');
      });

      // take a screenshot
      fetch('http://localhost:3000/screenshots', {
        method: 'POST',
      });
    }
  }, 1000);
});
*/
