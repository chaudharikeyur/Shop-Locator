const map = L.map('map').setView([19.0760, 72.8777], 12); // Mumbai coords


const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const tileLayer = L.tileLayer(tileUrl, { attribution });
tileLayer.addTo(map);


const myIcon = L.icon({
  iconUrl: 'marker.png',
  iconSize: [30, 40]
});

// 🧠 Function to generate the outlet list
function generateList() {
  let ul = document.querySelector('.list');
  storeList.forEach((shop) => {
    const li = document.createElement('li');
    const div = document.createElement('div');
    const a = document.createElement('a');
    const p = document.createElement('p');

    div.classList.add('shop-item');

    a.innerText = shop.properties.name;
    a.href = '#';
    a.addEventListener('click', () => {
        flyToStore(shop);
    });
    p.innerText = shop.properties.address;

    div.appendChild(a);
    div.appendChild(p);
    li.appendChild(div);
    ul.appendChild(li);
  });
}

generateList();


function makePopupContent(shop) {
    return `
      <div>
          <h4>${shop.properties.name}</h4>
          <p>${shop.properties.address}</p>
          <div class="phone-number">
              <a href="tel:${shop.properties.phone}">${shop.properties.phone}</a>
          </div>
      </div>
    `;
  }
  function onEachFeature(feature, layer) {
      layer.bindPopup(makePopupContent(feature), { closeButton: true, offset: L.point(0, -8) });
  }

// 🔧 Add store markers to the map
const shopsLayer = L.geoJSON({
  type: "FeatureCollection",
  features: storeList
}, {
  onEachFeature: onEachFeature,
  pointToLayer: function(feature, latlng) {
    return L.marker(latlng, { icon: myIcon });
  }
});

shopsLayer.addTo(map);


function flyToStore(store) {
    const lat = store.geometry.coordinates[1];
    const lng = store.geometry.coordinates[0];
    map.flyTo([lat, lng], 14, {
        duration: 3
    });
    setTimeout(() => {
        L.popup({closeButton: false, offset: L.point(0, -8)})
        .setLatLng([lat, lng])
        .setContent(makePopupContent(store))
        .openOn(map);
    }, 2000);
}