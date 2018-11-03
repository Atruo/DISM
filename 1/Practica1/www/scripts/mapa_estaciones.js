// Mapa estaciones

function localizarEstaciones() {

    var map = new Microsoft.Maps.Map(document.getElementById('mapaEst'), { credentials: 'ArapQL_90y_pC9SInxjpAygl3kIgXJomDja0LTww44lc2vVc_i2HBXl_1SSXBpmp' });
    map.setView({
        mapTypeId: Microsoft.Maps.MapTypeId.aerial,
        center: new Microsoft.Maps.Location(40.415363, -3.707398),
        zoom: 5.3
    });

    var datos;
    var key = '123456789';
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": `http://localhost:8080/estaciones?key=${key}`,
        "method": "GET",
        "headers": {
            "cache-control": "no-cache"
        }
    } 
    $.ajax(settings).done(function (response) {//Procesar y almacenar las latitudes y longitudes
        
            var datos = (response);
           
            var latlongs = [];
            for (var j = 0; j < datos.length; j++) {
                var add = {
                    lat: datos[j].latitud,
                    long: datos[j].longitud
                };
                latlongs.push(add);
            }

            var ha, ma, sa;
            var ho, mo, so;
            var lati, longi;
            var latlongsConvertido = [];

            for (let i = 0; i < latlongs.length; i++) {
                ha = latlongs[i].lat[0] + latlongs[i].lat[1];
                ma = latlongs[i].lat[2] + latlongs[i].lat[3];
                sa = latlongs[i].lat[4] + latlongs[i].lat[5];

                ho = latlongs[i].long[0] + latlongs[i].long[1];
                mo = latlongs[i].long[2] + latlongs[i].long[3];
                so = latlongs[i].long[4] + latlongs[i].long[5];
                lati = parseInt(ha) + (parseInt(ma) / 60) + (parseInt(sa) / 3600);
                longi = parseInt(ho) + (parseInt(mo) / 60) + (parseInt(so) / 3600);
                if (latlongs[i].lat[6] === 'S') {
                    lati = lati * -1
                }
                if (latlongs[i].long[6] === 'W') {
                    longi = longi * -1
                }
                let add = {
                    lat: lati,
                    long: longi
                };
                latlongsConvertido.push(add);
            }


            var infobox;
            infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
                visible: false
            });
            infobox.setMap(map);
            for (var i = 0; i < latlongsConvertido.length; i++) {//Bucle para poner los puntos

                var pin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location((latlongsConvertido[i].lat), (latlongsConvertido[i].long)));

                pin.metadata = {
                    title: datos[i].nombre,
                    description: 'Altitud:' + datos[i].altura
                };


                Microsoft.Maps.Events.addHandler(pin, 'click', pushpinClicked);
                map.entities.push(pin);
            }
            function pushpinClicked(e) {
                if (e.target.metadata) {

                    infobox.setOptions({
                        location: e.target.getLocation(),
                        title: e.target.metadata.title,
                        description: e.target.metadata.description,
                        visible: true
                    });
                }
            }

        });


   


}
