// Datos de estaciones

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
        //Aqui no entra por algún motivo que desconozco
    }).fail(function (res) {

        var datos = JSON.parse(res.responseText).datos;


        $.get(datos, function (data, status) {
            var mostrar,
                sol = [];
            data = JSON.parse(data);
            for (let i = 0; i < data.length; i++) {
                mostrar = {
                    'idema': idema,
                    'ubicacion': data[i].ubi,
                    'fecha_hora': data[i].fint,
                    'temperatura': data[i].ts
                }
                sol.push(mostrar);
            }

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



