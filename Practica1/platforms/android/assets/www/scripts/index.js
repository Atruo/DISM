﻿

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

function misDatos() {
    var modal = document.getElementById('myModal');
    var datos = document.getElementById('datos');
    var span = document.getElementsByClassName("close")[0];
    datos.innerHTML = `<strong>Nombre:</strong> Sergio Bañuls Martínez <br> <strong>DNI:</strong> 48791763T <br><strong>Email:</strong> sbm72@alu.ua.es<br><br><img src="images/ua.jpg" alt="ua" id="foto" />`;
    modal.style.display = "block";
    span.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}