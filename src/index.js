import './style.css';
import { format } from 'date-fns';


async function getInfo(city = 'Toronto'){
    try{
        const requestURL = 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=b5cbb3f964e02efd8749d37350f5f4b0&units=metric';
        const request = new Request(requestURL);
        const response = await fetch(request);
        const weather = await response.json();
        console.log(weather)
        console.log(process(weather));
        create(process(weather));
    } catch (error){
        cityError();
        return;
    }
    
};
getInfo();

// getInfo().catch(err => {
//     console.error(err);
// });

function cityError(){
    let search = document.getElementById('search');
    console.log(search.childNodes)
        if (search.childNodes.length == 3){
            search.append('invalid search');
        }
}

function process(data){
    const obj = data;
    const { name: city, main: { temp: mainTemp, feels_like: feelTemp, humidity: humidity }, 
    wind: { speed: windSpeed }, weather: { 0: { main: condition }}, sys: { country: country }} = obj;
    return { city, mainTemp, feelTemp, humidity, windSpeed, condition, country }
}
function switchUnits(data, unit){
    //switch units
    const body = document.querySelector('body');
    const switchUnits = document.createElement('button');
    switchUnits.innerText = 'Change units';
    switchUnits.addEventListener('click', function(){
        if (unit == 'imperial'){
            console.log('on')
            create(data, 'metric')
        } 
        else if (unit == 'metric'){
            console.log('off')
            create(data, 'imperial');
        }
    })

    return switchUnits;
}

function create(data, unit= 'metric'){
    
    //title
    const body = document.querySelector('body');
    body.innerHTML = '';
    const place = document.createElement('h1');
    let city = data.city;
    let country = getCountry(data.country);
    place.append(city+`, `+country);
    const date = document.createElement('div');
    let today = format(new Date(), 'MMMM d, Y');
    date.append(today);
    place.append(date);
    body.append(place);
    body.append(switchUnits(data, unit));
    

    //data
    // let unit = 'metric';
    const atmosphere = document.createElement('div');
    atmosphere.innerText = data.condition;

    const current = document.createElement('div');
    const feels = document.createElement('div');
    const wind = document.createElement('div');
    if (unit == 'metric'){
        current.innerText = 'Current temp: '+ (data.mainTemp).toFixed(1)+' \u00B0C';
        feels.innerText = 'Feels like: '+ (data.feelTemp).toFixed(1)+' \u00B0C';
        wind.innerText = 'Wind: '+ ((data.windSpeed)*3.6).toFixed(1) + ' km/h';
    }
    else if (unit == 'imperial'){
        current.innerText = 'Current temp: '+ ((data.mainTemp)*(9/5)+32).toFixed(1)+' \u00B0F';
        feels.innerText = 'Feels like: '+ ((data.feelTemp)*(9/5)+32).toFixed(1)+' \u00B0F';
        wind.innerText = 'Wind: '+ ((data.windSpeed)*2.23694).toFixed(1) + ' mph';
    }
    

    const humidity = document.createElement('div');
    humidity.innerText = 'Humidity: '+ data.humidity +'%';

    body.append(atmosphere, current, feels, wind, humidity);

    //search
    const searchCon = document.createElement('div');
    searchCon.id = 'search';
    const label = document.createElement('span');
    label.innerText = 'Search for a city: '
    const search = document.createElement('input');
    search.setAttribute('type', 'text');
    const submit = document.createElement('button');
    submit.innerText = 'Submit';

    submit.addEventListener('click', function(){
        let toSearch = search.value;
        getInfo(toSearch);
    });
    searchCon.append(label, search, submit);
    body.append(searchCon);
    
}


function getCountry(countrySC){
    let country = new Intl.DisplayNames(['en'], {type: 'region'});
    return country.of(countrySC);
}

