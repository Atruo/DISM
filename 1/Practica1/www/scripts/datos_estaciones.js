// Datos de estaciones
var click = 0;
function getIdema() {
    click++;
    var idema = document.getElementById('idema').value;
    console.log(idema);//Muestro el idema por consola
    var datos;
    var key = 'abcdefghi';
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": `http://localhost:8080/observacion?key=${key}`,
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            'Accept': 'application/javascript'
        }
    }
    console.log(settings.url);//Muestro la url por consola





    $.ajax(settings).done(function (response) {
            var mostrar,
            sol = [];
            var data = '';
            
            for (var i = 0; i < response.length; i++) {
                if (response[i].id === idema) {                    
                    mostrar = {
                        'idema': idema,
                        'ubicacion': response[i].ubicacion,
                        'fecha_hora': response[i].fechahora,
                        'temperatura': response[i].temperatura
                    }
                    sol.push(mostrar);
                                      
                }
            }
          
         
            if (click === 1 ) {
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
            } else {
                tabla.destroy();
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
                cont = 0;
            }



        });

    
}
