function mapInit() {
  let map = L.map('mapid').setView([51.505, -0.09], 13);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiY21hbm5peDEiLCJhIjoiY2ttNndkNTE3MHNkdDJ5bzl5dWltamYwYyJ9.EX7hr3OsYksLFp_m5hWU9Q'
}).addTo(map);
  return map;
}

async function dataHandler(mapObjectFromFunction) {
  // use your assignment 1 data handling code here
  // and target mapObjectFromFunction to attach markers
    const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';
  
    const request = await fetch(endpoint);
    const restaurants = await request.json();
  
    function findMatches(wordToMatch, restaurants) {
      const tempArr = restaurants.filter(place => {
        const regex = new RegExp(wordToMatch, 'gi');
        return place.zip.match(regex)
      });
      const tempSet = new Set(tempArr.map(place => place.establishment_id));
      const unique_ids = Array.from(tempSet).slice(0,9);
      console.log(unique_ids);
      let id_length  = unique_ids.length-1;
      const results = [];
      //iterate through the list
      while (id_length >= 0) {
        for (place in restaurants) {
          // compare the value of the restaurants key to value in unique keys
          if (restaurants[place].establishment_id == unique_ids[id_length] && unique_ids.length > 0) {
            
            let catThis = restaurants[place];
            results.push(catThis);
            console.log(unique_ids.pop());
            id_length = unique_ids.length-1;
          }
        }
      }
      return results;
    }
  
  function displayMatches(event) {
    event.preventDefault();
    const matchArray = findMatches(event.target.value, restaurants);
    const html = matchArray.map(place => {
      return `
      <div class="box">
        <li>
        <address>
          <h2 class="subtitle is-3"><span class="name">${place.name}</span></h2>
          <span class="address">${place.address_line_1}</span> <br>
          ${place.city}, ${place.state} ${place.zip} <br>
          </br>
          <span class="category">${place.category} <br>
          <span class="quarantining">Quarantining: ${place.ill_workers_restricted}</span>
        </address>
        </li>
      </div>
      `
    }).join('');
    suggestions.innerHTML= html;
  }
    const form  = document.querySelector('.form');
    const suggestions = document.querySelector('.suggestions');
  
    form.addEventListener('submit', (evt) => { displayMatches(evt) });
}

async function windowActions() {
  const map = mapInit();
  await dataHandler(map);
}
window.onload = windowActions();