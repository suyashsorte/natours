// to disable eslint
/* eslint-disable */

// console.log('dscasdcva');
// const locations = JSON.parse(document.getElementById('map').dataset.locations);
// console.log(location);

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoic3V5YXNoc29ydGUiLCJhIjoiY2thazRudWc0MGdtNjJxcGVrOHc3ZDl0NSJ9.HbXRa_1OEy2pc1_0KL4s_w';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/suyashsorte/ckak524250wqj1ipcumxbhk91',
    scrollZoom: false,
    // center: [-118.122063, 34.099173],
    // zoom: 10,
    // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // create marker
    const el = document.createElement('div');
    el.className = 'marker';
    // add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // extend map bounds to include curr loc
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
