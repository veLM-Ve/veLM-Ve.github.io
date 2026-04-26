const API_KEY = "7e2135ea0364d6a301e02ae4a4fed486";

const cityInput     = document.getElementById("cityInput");
const weatherBtn    = document.getElementById("weatherBtn");
const currentWeather = document.getElementById("currentWeather");
const forecast      = document.getElementById("forecast");

weatherBtn.addEventListener("click", search);
cityInput.addEventListener("keydown", e => { if (e.key === "Enter") search(); });

function search() {
  const city = cityInput.value.trim();
  if (!city) {
    showError("Wpisz nazwę miasta.");
    return;
  }
  getCurrentWeather(city);
  getForecast(city);
}

function showError(msg) {
  currentWeather.innerHTML = `<p class="error-msg">${msg}</p>`;
}

function getCurrentWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pl`;

  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      console.log("Current weather:", data);
      showCurrentWeather(data);
    } else {
      showError("Nie znaleziono miasta. Sprawdź nazwę i spróbuj ponownie.");
    }
  };

  xhr.onerror = () => showError("Błąd sieci.");
  xhr.send();
}

function showCurrentWeather(data) {
  currentWeather.style.display = "block";
  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
  const sunset  = new Date(data.sys.sunset  * 1000).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
  const iconCode = data.weather[0].icon;


  function tile(label, value) {
    return `<div><span class="label">${label}</span>${value}</div>`;
  }


  /* ============================= */
  /* fragment pomiędzy liniami został wygenerowany przez Claude */
  currentWeather.innerHTML = `
    <div class="current-main">
      <div>
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>${data.weather[0].description}</p>
      </div>
      <div class="weather-icon-wrap">
        <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${data.weather[0].description}">
      </div>
    </div>

    <div class="temp">${Math.round(data.main.temp)}°C</div>

    <div class="current-grid">
      ${tile("Odczuwalna",  `${Math.round(data.main.feels_like)}°C`)}
      ${tile("Wilgotność",  `${data.main.humidity}%`)}
      ${tile("Ciśnienie",   `${data.main.pressure} hPa`)}
      ${tile("Wiatr",       `${data.wind.speed} m/s`)}
      ${tile("Wschód",      sunrise)}
      ${tile("Zachód",      sunset)}
    </div>
  `;
  /* ============================= */
}

function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pl`;

  fetch(url)
    .then(r => r.json())
    .then(data => {
      console.log("Forecast:", data);
      showForecast(data);
    })
    .catch(() => {
      forecast.innerHTML = `<p class="error-msg">Błąd pobierania prognozy.</p>`;
    });
}

function showForecast(data) {
  forecast.style.display = "block";
  const items = data.list.filter(item =>
    item.dt_txt.includes("00:00:00") ||
    item.dt_txt.includes("06:00:00") ||
    item.dt_txt.includes("12:00:00") ||
    item.dt_txt.includes("18:00:00")
  );

  /* ============================= */
  const cards = items.map(item => {
    const dateObj = new Date(item.dt_txt);
    const date = dateObj.toLocaleDateString("pl-PL");
    const time = dateObj.toLocaleTimeString("pl-PL", { hour: '2-digit', minute: '2-digit' });
    return `
    <div class="forecast-card">
      <div class="fc-date">${date}</div>
      <div class="fc-time">${time}</div>
      <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}">
      <div class="fc-temp">${Math.round(item.main.temp)}°C</div>
      <div class="fc-desc">${item.weather[0].description}</div>
    </div>
  `;
  }).join("");
  /* fragment pomiędzy liniami został wygenerowany przez Claude */
  /* ============================= */

  forecast.innerHTML = `
    <h2>Prognoza 5-dniowa</h2>
    <div class="forecast-list">${cards}</div>
  `;
}
