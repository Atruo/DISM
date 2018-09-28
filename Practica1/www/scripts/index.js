var lat = 35.027222;
var long = -111.0225;

function datosMun50000() {
    var datos;
    var datosfiltrados2 = [];
    var key = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiYW55dWxzOThAZ21haWwuY29tIiwianRpIjoiYzQ3YzgyMzMtYzhjOC00OWQ5LTk0NzYtMDg2ZTczZGNmNDBjIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE1Mzc5NDcwMDksInVzZXJJZCI6ImM0N2M4MjMzLWM4YzgtNDlkOS05NDc2LTA4NmU3M2RjZjQwYyIsInJvbGUiOiIifQ.1Km6vaOtp-mmugfFkPhDYxziK_MZGdCAZG71Mi1ibJw';
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://opendata.aemet.es/opendata/api/maestro/municipios?api_key=" + key,
        "method": "GET",
        "headers": {
            "cache-control": "no-cache"
        }
    }


    InicializarGrid();
    console.log('aqui')
            function InicializarGrid() {
                $.ajax(settings).done(function (response) {
                    var j = 0;
                    //Parseo a objeto para filtrar y meter en datatable
                    datos = JSON.parse(response);
                    //Filtro los municipios que contengan "san vicente"
                    var cont = 0;
                    for (var i = 0; i < datos.length; i++) {
                        if (datos[i].num_hab >= 50000) {
                            datosfiltrados2[cont] = datos[i];
                            cont++;
                        }

                    }
                    tabla = $('#dataGrid').DataTable({
                        "data": datosfiltrados2,
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
                                "data": "num_hab"
                            }
                        ]
                    });
                });
            }
    
}
function estaciones() {//Tabla de las estaciones meteorologicas de espana
    //Hay que hacer dos gets porque el primero nos da una una url con el JSON

    var datos;   
    var key = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiYW55dWxzOThAZ21haWwuY29tIiwianRpIjoiYzQ3YzgyMzMtYzhjOC00OWQ5LTk0NzYtMDg2ZTczZGNmNDBjIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE1Mzc5NDcwMDksInVzZXJJZCI6ImM0N2M4MjMzLWM4YzgtNDlkOS05NDc2LTA4NmU3M2RjZjQwYyIsInJvbGUiOiIifQ.1Km6vaOtp-mmugfFkPhDYxziK_MZGdCAZG71Mi1ibJw';
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://opendata.aemet.es/opendata/api/valores/climatologicos/inventarioestaciones/todasestaciones?api_key=" + key,
        "method": "GET",
        "headers": {
            "cache-control": "no-cache"
        }
    }


    InicializarGrid();
 
    function InicializarGrid() {
        $.ajax(settings).done(function (response) {            
            settings = {
                "async": true,
                "crossDomain": true,
                "url": response.datos,
                "method": "GET",
                "headers": {
                    "cache-control": "no-cache"
                }
            }
            $.ajax(settings).done(function (response) {
                var datos = JSON.parse(response);
                
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
                            "data": "indicativo"
                        },
                        {
                            "defaultContent": "<button class = 'open'>Mapa</button>"
                        }
                        
                    ]
                });
                tabla.on('click', 'button', function () {//Lo que realiza el boton de cada columna
                    var modal = document.getElementById('myModal');
                    var mapa = document.getElementById('mapa');
                    var span = document.getElementsByClassName("close")[0];
                    //Cogemos la latitud y longitud de esa fila, como está en DMS y la aplicacion de BING funciona en decimal tenemos que convertirlo.
                    var data = tabla.row($(this).parents('tr')).data();
                    lat = data.latitud;
                    long = data.longitud;
                    var ha =lat[0]+lat[1],
                        ma = lat[2]+lat[3],
                        sa = lat[4] + lat[5];

                    var ho = long[0] + long[1],
                        mo = long[2] + long[3],
                        so = long[4] + long[5];

                    lat = parseInt(ha) + (parseInt(ma) / 60) + (parseInt(sa) / 3600);
                    long = parseInt(ho) + (parseInt(mo) / 60) + (parseInt(so) / 3600);
                    if (data.latitud[6] === 'S'){
                        lat = lat*-1
                    }
                    if (data.longitud[6] === 'W') {
                        long = long * -1
                    }
                    //Ya tenemos la latitud y longitud ahora creamos el mapa y mostramos el modal
                    GetMap();                    
                    modal.style.display = "block";
                    span.onclick = function () {
                        modal.style.display = "none";
                    }
                    window.onclick = function (event) {
                        if (event.target == modal) {
                            modal.style.display = "none";
                        }
                    }


                });
            });
            
            
        });
    }

}


function GetMap() {
 
    var map = new Microsoft.Maps.Map(document.getElementById('mapa'), { credentials: 'ArapQL_90y_pC9SInxjpAygl3kIgXJomDja0LTww44lc2vVc_i2HBXl_1SSXBpmp'});
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
    console.log(lat+'/'+long)
       
}

function localizarEstaciones() {
    
    var map = new Microsoft.Maps.Map(document.getElementById('mapaEst'), { credentials: 'ArapQL_90y_pC9SInxjpAygl3kIgXJomDja0LTww44lc2vVc_i2HBXl_1SSXBpmp' });
    map.setView({
        mapTypeId: Microsoft.Maps.MapTypeId.aerial,
        center: new Microsoft.Maps.Location(40.415363, -3.707398),
        zoom: 5.3
    }); 

    var datos;
    var key = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiYW55dWxzOThAZ21haWwuY29tIiwianRpIjoiYzQ3YzgyMzMtYzhjOC00OWQ5LTk0NzYtMDg2ZTczZGNmNDBjIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE1Mzc5NDcwMDksInVzZXJJZCI6ImM0N2M4MjMzLWM4YzgtNDlkOS05NDc2LTA4NmU3M2RjZjQwYyIsInJvbGUiOiIifQ.1Km6vaOtp-mmugfFkPhDYxziK_MZGdCAZG71Mi1ibJw';
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://opendata.aemet.es/opendata/api/valores/climatologicos/inventarioestaciones/todasestaciones?api_key=${key}`,
        "method": "GET",
        "headers": {
            "cache-control": "no-cache"
        }
    }   
        $.ajax(settings).done(function (response) {
            settings = {
                "async": true,
                "crossDomain": true,
                "url": response.datos,
                "method": "GET",
                "headers": {
                    "cache-control": "no-cache"
                }
            }
            $.ajax(settings).done(function (response) {//Procesar y almacenar las latitudes y longitudes
                var datos = JSON.parse(response);      
                var latlongs = [];
                for (var j = 0; j < datos.length; j++) {
                    var add = {
                        lat: datos[j].latitud,
                        long: datos[j].longitud
                    };
                    latlongs.push(add);
                }
                
                var ha, ma ,sa;
                var ho, mo, so;
                var lati, longi;
                var latlongsConvertido = [];

                for (let i = 0; i < latlongs.length; i++){
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
                        description: 'Altitud:'+ datos[i].altitud
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


        });

        
}

function getIdema() {

    var idema = document.getElementById('idema').value;
    console.log(idema);//Muestro el idema por consola
    var datos;
    var key = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiYW55dWxzOThAZ21haWwuY29tIiwianRpIjoiYzQ3YzgyMzMtYzhjOC00OWQ5LTk0NzYtMDg2ZTczZGNmNDBjIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE1Mzc5NDcwMDksInVzZXJJZCI6ImM0N2M4MjMzLWM4YzgtNDlkOS05NDc2LTA4NmU3M2RjZjQwYyIsInJvbGUiOiIifQ.1Km6vaOtp-mmugfFkPhDYxziK_MZGdCAZG71Mi1ibJw';
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://opendata.aemet.es/opendata/api/observacion/convencional/datos/estacion/${idema}?api_key=${key}`,
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            'Accept': 'application/javascript'
        }
    }
    console.log(settings.url);//Muestro la url por consola



    $.ajax(settings).done(function (response) {
        console.log('entro');//Compruebo si he entrado
        //console.log(JSON.parse(response));
    }).fail(function (res) {
        console.log('mal')
        var datos = JSON.parse(res.responseText).datos;
        console.log(datos);
        
        $.get(datos, function (data, status) {
            var mostrar,
                sol = [];
            data = JSON.parse(data);
            for (let i = 0; i < data.length; i++){
                mostrar = {
                    'idema': idema,
                    'ubicacion': data[i].ubi,
                    'fecha_hora': data[i].fint,
                    'temperatura': data[i].ts
                }
                sol.push(mostrar);
            }
            console.log(data[0])
            tabla = $('#datos').DataTable({//Crear Tabla de datos
                "data": sol,
                "columns": [
                    {
                        "data": "idema"
                    },
                    {
                        "data": "ubicacion"
                    },
                    {
                        "data": "fecha_hora"
                    },
                    {
                        "data": "temperatura"
                    }

                ]
            });

            
        });

    });
}

    
    
