const input = document.querySelector('#input');
const button = document.querySelector('#button');
const output = document.querySelector('#output-container');
const currentDiv = document.querySelector('#current-div');
const forecastDiv = document.querySelector('#forecast-div');

const API_KEY = '7054e9df9b4f86f9c2e31dea430445e2';

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function getWeather() {
  currentDiv.innerHTML = '';
  forecastDiv.innerHTML = '';
  output.classList.remove('visible');

  const city = input.value.trim();
  if (!city) {
    alert("City name can't be empty");
    input.value = '';
    return;
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    const { temp, humidity } = data.main;
    const { description, icon } = data.weather[0];
    const { lat, lon } = data.coord;

    currentDiv.innerHTML = `
      <h3>${city.toUpperCase()}</h3>
      <h5>Current Weather</h5>
      <hr>
      <h4>Temperature: <strong>${temp}</strong>°C</h4>
      <p>Humidity: ${humidity}%</p>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" />
      <p>${description}</p>
    `;

    const res2 = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data2 = await res2.json();
    if (!res2.ok) throw new Error(data2.message);

    data2.list.slice(0, 5).forEach((item) => {
      const time = new Date(item.dt * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      const temp = Math.round(item.main.temp);
      const { icon, description } = item.weather[0];

      const card = document.createElement('div');
      card.className = 'forecast-card';
      card.innerHTML = `
        <p><strong>${time}</strong></p>
        <hr>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" />
        <p><i class="bi bi-thermometer-half"></i> ${temp}°C</p>
        <p><i class="bi bi-cloud-sun"></i> ${description}</p>
      `;
      forecastDiv.appendChild(card);
    });

    input.value = '';
    await delay(200);
    output.classList.add('visible');

  } catch (error) {
    alert('City not found');
    console.error(error);
    input.value = '';
  }
}

button.addEventListener('click', getWeather);
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') getWeather();
});

