// Estaciones
var lat = 35.027222;
var long = -111.0225;

function estaciones() {//Tabla de las estaciones meteorologicas de espana
    //Hay que hacer dos gets porque el primero nos da una una url con el JSON

    var datos;
    var key = '987654321';
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:8080/estaciones?key=" + key,
        "method": "GET",
        "headers": {
            "cache-control": "no-cache"
        }
    }

          
            $.ajax(settings).done(function (response) {
                var datos = (response);

                tabla = $('#estaciones').DataTable({//Crear Tabla de estaciones
                    "data": datos,
                    "columns": [
                        {
                            "data": "nombre"
                        },
                        {
                            "data": "latitud"
                        },
                        {
                            "data": "longitud"
                        },
                        {
                            "data": "id"
                        },
                        {
                            "defaultContent": "<button  class='btn btn- outline - info' data-toggle='modal' data-target='#modal_mapa'>Mapa</button>"
                        }

                    ]
                });
                tabla.on('click', 'button', function () {//Lo que realiza el boton de cada columna
                    var modal = document.getElementById('myModal');
                    var mapa = document.getElementById('mapa');
                    var span = document.getElementsByClassName("close")[0];
                    //Cogemos la latitud y longitud de esa fila, como est� en DMS y la aplicacion de BING funciona en decimal tenemos que convertirlo.
                    var data = tabla.row($(this).parents('tr')).data();
                    lat = data.latitud;
                    long = data.longitud;
                    var ha = lat[0] + lat[1],
                        ma = lat[2] + lat[3],
                        sa = lat[4] + lat[5];

                    var ho = long[0] + long[1],
                        mo = long[2] + long[3],
                        so = long[4] + long[5];

                    lat = parseInt(ha) + (parseInt(ma) / 60) + (parseInt(sa) / 3600);
                    long = parseInt(ho) + (parseInt(mo) / 60) + (parseInt(so) / 3600);
                    if (data.latitud[6] === 'S') {
                        lat = lat * -1
                    }
                    if (data.longitud[6] === 'W') {
                        long = long * -1
                    }
                    //Ya tenemos la latitud y longitud ahora creamos el mapa y mostramos el modal
                    
                    GetMap();

                });
            });


  
}


function GetMap() {

    var map = new Microsoft.Maps.Map(document.getElementById('mapa'), { credentials: 'ArapQL_90y_pC9SInxjpAygl3kIgXJomDja0LTww44lc2vVc_i2HBXl_1SSXBpmp' });
    map.setView({
        mapTypeId: Microsoft.Maps.MapTypeId.aerial,
        center: new Microsoft.Maps.Location(lat, long),
        zoom: 15
    });
    var pushpin = new Microsoft.Maps.Pushpin(map.getCenter(), {
        icon: 'https://www.bingmapsportal.com/Content/images/poi_custom.png',
        anchor: new Microsoft.Maps.Point(12, 39)
    });
    map.entities.push(pushpin);
    console.log(lat + '/' + long)

}

