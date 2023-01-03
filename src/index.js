async function create(city = 'London'){
    const requestURL = 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=b5cbb3f964e02efd8749d37350f5f4b0';
    const request = new Request(requestURL);
    const response = await fetch(request);
    const weather = await response.json();
    console.log(weather);

    createTitle(weather);
}

create();

function createTitle(weather){
    const body = document.querySelector('body');
    const place = document.createElement('h1');
    let city = weather.name;
    let country = getCountry(weather.sys.country);
    place.append(city+`, `+country);
    body.append(place);
}

function getCountry(countrySC){
    let country = new Intl.DisplayNames(['en'], {type: 'region'});
    return country.of(countrySC);
}