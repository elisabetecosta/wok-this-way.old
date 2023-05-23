function initMap() {

    // Variables holding data from the show.ejs file
    const lng = longitude
    const lat = latitude
    const content = contentString

    const center = { lat: lat, lng: lng }

    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: center,
        mapId: "8e576c186c0dad44",
        scrollwheel: false
    })

    const infowindow = new google.maps.InfoWindow({
        content: content
    })

    const marker = new google.maps.Marker({
        position: center,
        map: map
    })
    
    marker.addListener('click', function () {
        infowindow.open(map, marker)
    })
}