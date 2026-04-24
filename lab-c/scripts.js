const COLS = 4, ROWS = 4;

map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
marker = L.marker([53.430127, 14.564802]).addTo(map);

if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

buildBoard();

document.getElementById("saveButton").addEventListener("click", function () {

  leafletImage(map, function (err, canvas) {

    let rasterMap = document.getElementById("rasterMap");
    let ctx = rasterMap.getContext("2d");

    rasterMap.width = canvas.width;
    rasterMap.height = canvas.height;

    ctx.drawImage(canvas, 0, 0);

    rasterMap.style.display = "block";

    document.getElementById("canvas-hint").style.display = "none";

    splitIntoPuzzle(canvas);
  });

});

document.getElementById("getLocation").addEventListener("click", function(event) {
  if (! navigator.geolocation) {
    console.log("No geolocation.");
  }

  navigator.geolocation.getCurrentPosition(position => {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    document.getElementById("latitude").innerText = lat;
    document.getElementById("longitude").innerText = lon;

    map.setView([lat, lon]);
    marker.setLatLng([lat, lon]);
  }, positionError => {
    console.error(positionError);
  });
});

function splitIntoPuzzle(canvas) {

  let pw = Math.floor(canvas.width  / COLS);
  let ph = Math.floor(canvas.height / ROWS);

  let pieces = [];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {

      let idx = row * COLS + col;

      /* ============================= */
      let pc = document.createElement('canvas');
      pc.width  = pw;
      pc.height = ph;
      pc.getContext('2d').drawImage(
        canvas,                                               /* fragment pomiędzy liniami został wygenerowany przez Claude */
        col * pw, row * ph,
        pw, ph,
        0, 0, pw, ph
      );

      pieces.push({ idx, canvas: pc });
      /* ============================= */
    }
  }

  for (let i = pieces.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }

  renderPieces(pieces);
  buildBoard();
}

function renderPieces(pieces) {

  let table = document.getElementById('puzzle-table');
  table.innerHTML = '';

  /* ============================= */

  for (let piece of pieces) {
    let img       = document.createElement('img');
    img.src       = piece.canvas.toDataURL();
    img.className = 'piece';
    img.draggable = true;
    img.id        = 'piece-' + piece.idx;
    img.dataset.idx = piece.idx;
    table.appendChild(img);
  }
                                                                        /* fragment pomiędzy liniami został wygenerowany przez Claude */
  let items = table.querySelectorAll('.piece');
  for (let item of items) {
    item.addEventListener("dragstart", function(event) {
      this.style.border = "5px dashed #D8D8FF";
      event.dataTransfer.setData("text", this.id);
    });
    item.addEventListener("dragend", function(event) {
      this.style.borderWidth = "0";
    });
  }

  /* ============================= */

  let targets = table;
  targets.addEventListener("dragenter", function(event) {
    this.style.border = "2px solid #7FE9D9";
  });
  targets.addEventListener("dragleave", function(event) {
    this.style.border = "2px dashed #7f7fe9";
  });
  targets.addEventListener("dragover", function(event) {
    event.preventDefault();
  });
  targets.addEventListener("drop", function(event) {
    let myElement = document.querySelector("#" + event.dataTransfer.getData('text'));
    this.appendChild(myElement);
    this.style.border = "2px dashed #7f7fe9";
  }, false);
}

function buildBoard() {

  let board = document.getElementById('puzzle-board');
  board.innerHTML = '';

  for (let i = 0; i < ROWS * COLS; i++) {
    let slot = document.createElement('div');
    slot.className   = 'slot';
    slot.dataset.pos = i;
    board.appendChild(slot);
  }

  let targets = board.querySelectorAll('.slot');
  for (let target of targets) {
    target.addEventListener("dragenter", function(event) {
      this.style.border = "2px solid #7FE9D9";
    });
    target.addEventListener("dragleave", function(event) {
      this.style.border = "2px dashed #7f7fe9";
    });
    target.addEventListener("dragover", function(event) {
      event.preventDefault();
    });
    target.addEventListener("drop", function(event) {
      let myElement = document.querySelector("#" + event.dataTransfer.getData('text'));
      if (!myElement) return;

      let existing = this.querySelector('img');
      if (existing) {
        document.getElementById('puzzle-table').appendChild(existing);
      }

      this.appendChild(myElement);
      this.style.border = "2px dashed #7f7fe9";
      checkWin();
    }, false);
  }
}

function checkWin() {
  const slots = document.querySelectorAll('.slot');
  let correct = 0;

  slots.forEach(slot => {
    const img = slot.querySelector('img');

    if (img && img.dataset.idx == slot.dataset.pos) {
      slot.classList.add('correct');
      correct++;
    } else {
      slot.classList.remove('correct');
    }
  });

  if (correct === slots.length) {
    console.debug("Brawo! Ułożyłeś puzzle");

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Brawo!", {
        body: "Ułożyłeś puzzle",
      });
      alert("Brawo! Ułożyłeś puzzle");
    } else {
      alert("Brawo! Ułożyłeś puzzle");
    }

  }
}
