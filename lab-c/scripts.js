
function getLocation() {
  if (!navigator.geolocation) {
    alert("Brak geolokalizacji!");
    return;
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    document.getElementById("latitude").innerText = lat;
    document.getElementById("longitude").innerText = lon;

    map.setView([lat, lon], 13);

    L.marker([lat, lon])
      .addTo(map)
      .bindPopup("You are here!")
      .openPopup();

  }, (err) => {
    console.error(err);
  });
}


// DRAG
document.addEventListener("dragstart", function(event) {
  if (event.target.classList.contains("item")) {
    event.target.style.border = "5px dashed #D8D8FF";
    event.dataTransfer.setData("text", event.target.id);
  }
});

document.addEventListener("dragend", function(event) {
  if (event.target.classList.contains("item")) {
    event.target.style.borderWidth = "0";
  }
});



// DROP
let targets = document.querySelectorAll(".slot, #stolbez");

for (let target of targets) {
  target.addEventListener("dragenter", function () {
    if (this.classList.contains("slot")) {
      this.style.backgroundColor = "#7FE9D9";
    } else if (this.id === "stolbez") {
      this.style.border = "2px solid #7FE9D9";
    }
  });

  target.addEventListener("dragleave", function () {
    if (this.classList.contains("slot")) {
      this.style.backgroundColor = "#f5f5f5";
    } else if (this.id === "stolbez") {
      this.style.border = "none";
    }
  });

  target.addEventListener("dragover", function (event) {
    event.preventDefault();
  });

  target.addEventListener("drop", function (event) {
    let el = document.querySelector("#" + event.dataTransfer.getData('text'));

    if (this.classList.contains("slot")) {
      if (this.children.length === 0) {
        this.appendChild(el);
      }
    } else if (this.id === "stolbez") {
      this.appendChild(el);
    }
  });
}


// MAPA
let map = L.map('mapa').setView([51.505, -0.09], 13);

L.tileLayer(
  'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  {
    attribution: 'Esri',
    crossOrigin: true
  }
).addTo(map);


function createTilePuzzleFromCanvas(canvas) {
  const stolbez = document.getElementById("stolbez");
  stolbez.innerHTML = "";

  const rows = 4;
  const cols = 4;

  const tileWidth = canvas.width / cols;
  const tileHeight = canvas.height / rows;

  let tiles = [];
  let index = 0;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {

      const tileCanvas = document.createElement("canvas");
      tileCanvas.width = tileWidth;
      tileCanvas.height = tileHeight;

      const ctx = tileCanvas.getContext("2d");

      ctx.drawImage(
        canvas,
        x * tileWidth,
        y * tileHeight,
        tileWidth,
        tileHeight,
        0,
        0,
        tileWidth,
        tileHeight
      );

      const img = new Image();
      img.src = tileCanvas.toDataURL();
      img.className = "item";
      img.id = "tile" + index;
      img.draggable = true;

      tiles.push(img);
      index++;
    }
  }

  tiles.sort(() => Math.random() - 0.5);
  tiles.forEach(t => stolbez.appendChild(t));
}


document.getElementById('captureMapBtn').addEventListener('click', () => {

  setTimeout(() => {

    html2canvas(document.getElementById("mapa"), {
      useCORS: true,
      scale: 1
    }).then(canvas => {

      createTilePuzzleFromCanvas(canvas);

    });

  }, 600);

});

document.getElementById("captureMapBtn").addEventListener("click", () => {
  leafletImage(map, function(err, canvas) {
    if (err) return console.error(err);

    // Tworzymy ukryty canvas w tle
    let targetCanvas = document.getElementById("canvas");
    if (!targetCanvas) {
      targetCanvas = document.createElement("canvas");
      targetCanvas.id = "canvas";
      targetCanvas.style.display = "none"; // nie pokazujemy
      document.body.appendChild(targetCanvas);
    }

    const ctx = targetCanvas.getContext("2d");
    targetCanvas.width = canvas.width;
    targetCanvas.height = canvas.height;
    ctx.drawImage(canvas, 0, 0);

    // Teraz puzzle z canvas
    createTilePuzzleFromCanvas(targetCanvas);
  });
});
