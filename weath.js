const API_key = "327e89e9d1e2a7c9a6d0e91a7f582c40";
  

const userTab = document.querySelector("[data-userweather]");
const searchTab = document.querySelector("[data-searchweather]");
const userContainer = document.querySelector(".weather-container");
const grantAcessContainer = document.querySelector(".grantlocation-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfocontainer = document.querySelector(".user-info-container");


let currentTab = userTab;
currentTab.classList.add("current-tab");
getfromSessionStorage();

userTab.addEventListener("click" , () => {
    switchTab(userTab);
});

searchTab.addEventListener("click" , () => {
    switchTab(searchTab);
});

function switchTab(clickedTab) {
    if(clickedTab != currentTab ){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfocontainer.classList.remove("active");
            grantAcessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
      32
    }
}

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("userCoordinates");

    if(!localCoordinates) {
        grantAcessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, longi} = coordinates;

    grantAcessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${longi}&appid=${API_key}`);

        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfocontainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch(err){
        loadingScreen.classList.remove("active");
    }

}

function renderWeatherInfo(weatherinfo) {

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDescription]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temperature = document.querySelector("[data-temperature]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloud = document.querySelector("[data-cloud]");

    cityName.innerText = weatherinfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherinfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${weatherinfo?.weather?.[0]?.icon}@2x.png`;
    temperature.innerText = `${weatherinfo?.main?.temp} °F`;
    windSpeed.innerText = `${weatherinfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherinfo?.main?.humidity}%`;
    cloud.innerText = `${weatherinfo?.clouds?.all}%`
     
}


function showPosition(position) {

    const userCoordinates = {
        lat : position.coords.latitude,
        longi : position.coords.longitude
    };

    sessionStorage.setItem("userCoordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
    
}


function getLocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{

    }
}



const grantAccessbutton = document.querySelector("[data-grantAccess]")
grantAccessbutton.addEventListener("click" , getLocation);



const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit" , (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
       return;
    else
       fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(cityName) {
    loadingScreen.classList.add("active");
    userInfocontainer.classList.remove("active");
    grantAcessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_key}`);
        const data1 = await response.json();
        loadingScreen.classList.remove("active");
        userInfocontainer.classList.add("active");
        renderWeatherInfo(data1);
    }
    catch(err){

    }
}