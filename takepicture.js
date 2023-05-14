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
/*
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
*/

function startTimer(button) {
  let countdown = 180; // 3 minutes in seconds
  let timer = setInterval(function () {
    countdown--;
    let minutes = Math.floor(countdown / 60);
    let seconds = countdown % 60;
    document.querySelector('#cooldown').textContent =
      minutes + ':' + (seconds < 10 ? '0' : '') + seconds; // Update the timer display
    if (countdown <= 0) {
      clearInterval(timer); // Stop the timer
      enableButtons(button); // Enable the button
      document.querySelector('#cooldown').textContent = ''; // Clear the timer display
    }
  }, 1000); // Run the timer every second
}

function disableButtons(button) {
  button.disabled = true; // Disable the capture button
  // Disable any other buttons or actions that should not be allowed during the cooldown period
}

function enableButtons(button) {
  button.disabled = false; // Enable the capture button
  // Enable any other buttons or actions that were disabled during the cooldown period
}

let countdownTimer = null;

captureBtn.addEventListener('click', () => {
  if (countdownTimer === null) {
    // Disable the button and prevent any other actions
    disableButtons(captureBtn);
    //takephoto
    let count = 3;
    const message = document.getElementById('message');
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
        message.textContent = 'Picture taken, thank you!';
      }
    }, 1000);

    //cooldown
    setTimeout(function () {
      startTimer(captureBtn); // Start the countdown timer and disable the button
      countdownTimer = setTimeout(() => {
        enableButtons(captureBtn); // Enable the button and allow actions
        countdownTimer = null; // Reset the countdown timer
        message.textContent = '';
      }, 180000); // Wait for 3 minutes before allowing the button to be clicked again
      document.querySelector('.cs-loader').style.display = 'block';
    }, 3000);
  }
});

//loader none
const cooldownEl = document.querySelector('#cooldown');
const mijnStatus = document.querySelector('#status');
mijnStatus.textContent = 'Status: you are good to go!';
cooldownEl.addEventListener('DOMSubtreeModified', function () {
  if (cooldownEl.textContent === '') {
    document.querySelector('.cs-loader').style.display = 'none';
    mijnStatus.textContent = 'Status: you are good to go!';
  } else {
    mijnStatus.textContent = 'Status: NFT making in progress... please wait';
  }
});
