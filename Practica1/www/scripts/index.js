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
    var datosfiltrados2 = [];
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
                    GetMap();
                    alert('Row index: ' + tabla.row(this).index());
                 
                    lat = 35.027222;
                    long = -111.0225;
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
    console.log(lat+'/'+long)
    

    
}
    
