// html elements
const cardsContainer = document.querySelector(".forecast-cards")

const searchBox = document.getElementById("searchBox");
const cityName = document.querySelector("p.location");
const allBars = document.querySelectorAll(".clock");
const cityContainer = document.querySelector(".city-items");
// app vaiables

let currentLocation = "Cairo, Egypt";

const apiKey = "b4f6a7cc6d514448ae7133125232208";
const baseUrl = `https://api.weatherapi.com/v1/forecast.json`;


// functions
async function getWeather(location) {
    const response = await fetch(`${baseUrl}?key=${apiKey}&q=${location}&days=7&q=${location}`);
    if (response.status !== 200)
        return
    const data = await response.json();
    displayWeather(data);
    searchBox.value = "";
};

//getWeather("Cairo")

function success(position) {
    // let test = `{position.coords.latitude},${position.coords.longitude}`;
    getWeather(currentLocation)

}
function displayWeather(data) {
    cityName.innerHTML = `<span class="city-name">${data.location.name}</span>, ${data.location.country}`
    const days = data.forecast.forecastday;
    let cardsHtml = "";
    const now = new Date()
    for (const [index, day] of days.entries()) {
        const date = new Date(day.date)
        cardsHtml += `
    <div class='${index === 0 ? "card active" : "card"} ' data-index=${index}>

    <div class="card-header">
    <div class="day"> ${date.toLocaleDateString("en-us", { weekday: "long" })} </div>
    <div class="time"> ${date.getHours() > 12 ? date.getHours() - 12 : date.getHours()} : ${date.getMinutes()} ${date.getHours() > 12 ? "PM" : "AM"} </div>
    </div>

    <div class="card-body">
    <img src="./images/conditions/${day.day.condition.text}.svg" />
    <div class="degree">${day.hour[now.getHours()].temp_c}C°</div>
    </div>
 
    <div class="card-data">
    <ul class="left-column">
    <li>Real Feel : <span class="real-feel">${day.hour[now.getHours()].feelslike_c}</span>  </li>
    <li>Wind : <span class="wind">${day.hour[now.getHours()].wind_mph}Mph</span> </li>
    <li>Pressure : <span class="pressure">${day.hour[now.getHours()].pressure_mb}Mb</span></li>
    <li>Humidity : <span class="humidity">${day.hour[now.getHours()].humidity}%</span></li>
    </ul>

    <ul class="right-column">
    <li>Sunrise : <span class="sunrise">${day.astro.sunrise}</span> </li>
    <li>Sunset : <span class="sunset">${day.astro.sunset}</span> </li>
    </ul>
    </div>

    </div> `

    }
    cardsContainer.innerHTML = cardsHtml
    const allCards = document.querySelectorAll(".card")
    for (const card of allCards) {
        card.addEventListener("click", function (event) {
            const activeCard = document.querySelector(".active")
            activeCard.classList.remove("active")
            event.currentTarget.classList.add("active")
            displayRainInfo(days[event.currentTarget.dataset.index])
        }

        )

    }
    displayCityImage(data.location.name, data.location.country)
}

function displayRainInfo(weatherinfo) {
    for (const element of allBars) {
        const clock = element.dataset.clock;
        const height = weatherinfo.hour[clock].chance_of_rain;
        element.querySelector(".percent").style.height = `${height}%`


    }
}

async function getCityImage(city) {
    const response = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${city}&client_id=maVgNo3IKVd7Pw7-_q4fywxtQCACntlNXKBBsFdrBzI&per_page=5&orientation=landscape`)
    const data = await response.json();
    return data

}
async function displayCityImage(city, country) {
    let imgArr = await getCityImage(city)
    const random = Math.trunc(Math.random() * imgArr.length);
    let imgScr = imgArr[random].urls.regular
    let itemContent = `
<div class="item">
<div class="city-img">
<img src="${imgScr}" alt="Image of ${city}">
</div>
<div class="city-name">
span class="city-name">${city}</span> , ${country}
</div>
</div>
`;
    cityContainer.innerHTML += itemContent
}
// events
window.addEventListener("load", function () {

    navigator.geolocation.getCurrentPosition(success);

});

searchBox.addEventListener("blur", function () {
    getWeather(this.value);
});

document.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
        getWeather(searchBox.value);
    }
})