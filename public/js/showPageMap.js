function initMap() {

    const lng = longitude
    const lat = latitude
    const center = { lat: lat, lng: lng }

    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: center,
        mapId: "8e576c186c0dad44",
        scrollwheel: false
    })


    /* BREAKS THE CODE AND THE MAP WONT SHOW 
    
    
    const contentString = `
    <strong>${buffetName}<br />
    ${buffetLocation}</strong>
    <p>${buffetDescription}</p>
  `
    const infowindow = new google.maps.InfoWindow({
        content: contentString
    }) */

    const marker = new google.maps.Marker({
        position: center,
        map: map
    })

    marker.addListener('click', function () {
        infowindow.open(map, marker)
    })
}