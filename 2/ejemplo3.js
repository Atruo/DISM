var express = require("express");
var mysql = require('mysql');
var app = express();
var bp = require('body-parser');
var request = require('request');//Para hacer peticiones GET
var iconv = require('iconv-lite');//Para UTF-8
var idemas = [];

const cors = require('cors');
app.use(cors());
app.options('*', cors());
app.use(bp.json());
var con = mysql.createConnection({
 host : '127.0.0.1',
 user : 'root',
 password : 'root',
 database : 'dism',
 port: '3311',
 charset : 'utf8'
 });


app.get('/municipios', function(req, resp) {
  var apto = false;

  con.query("SELECT * FROM claves", function (err, result, fields) {

     for (var i = 0; i < result.length; i++) {
       if (req.query.key === result[i].clave) {
         apto = true;
       }
     }
     if (apto === true) {
       con.query("SELECT * FROM municipios", function (err, result, fields) {
         if (err) throw err;
         resp.status(200);
         resp.send(result);
       });
     }else {
        resp.send('Wrong key');
     }

  });
console.log('se han pedido los municipios');

});
app.get('/estaciones', function(req, resp) {
  var apto = false;

  con.query("SELECT * FROM claves", function (err, result, fields) {

     for (var i = 0; i < result.length; i++) {
       if (req.query.key === result[i].clave) {
         apto = true;
       }
     }
     if (apto === true) {
       con.query("SELECT * FROM estaciones", function (err, result, fields) {
         if (err) throw err;
         resp.status(200);
         resp.send(result);
       });
     }else {
        resp.send('Wrong key');
     }

  });
  console.log('Se han pedido las estaciones');
});
app.get('/observacion', function(req, resp) {
  var apto = false;

  con.query("SELECT * FROM claves", function (err, result, fields) {

     for (var i = 0; i < result.length; i++) {
       if (req.query.key === result[i].clave) {
         apto = true;
       }
     }
     if (apto === true) {
       con.query("SELECT * FROM datos", function (err, result, fields) {
         if (err) throw err;
         resp.status(200);
         resp.send(result);
       });
     }else {
        resp.send('Wrong key');
     }

  });
  console.log('se han pedido los datos de observacion');
});
app.get('/introducirDatos', function(req, resp) {
  var apto = false;

  con.query("SELECT * FROM claves", function (err, result, fields) {

     for (var i = 0; i < result.length; i++) {
       if (req.query.key === result[i].clave) {
         apto = true;
       }
     }
     if (apto === true) {
       //Introducir municipios

         var datos;
         var key = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiYW55dWxzOThAZ21haWwuY29tIiwianRpIjoiYzQ3YzgyMzMtYzhjOC00OWQ5LTk0NzYtMDg2ZTczZGNmNDBjIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE1Mzc5NDcwMDksInVzZXJJZCI6ImM0N2M4MjMzLWM4YzgtNDlkOS05NDc2LTA4NmU3M2RjZjQwYyIsInJvbGUiOiIifQ.1Km6vaOtp-mmugfFkPhDYxziK_MZGdCAZG71Mi1ibJw';
         var url = "https://opendata.aemet.es/opendata/api/maestro/municipios?api_key=" + key;//URL para los municipios
         var municipios;
         var requestOptions  = { encoding: null, method: "GET", uri: url};
         var sql;
         request(requestOptions, function(error, response, body) {
             var municipios = iconv.decode(new Buffer(body), "ISO-8859-1");//Para que este en UTF-8
             municipios = JSON.parse(municipios);//Lista de todos los municipios de AEMET
             //borramos la tabla existente
               sql = "DROP TABLE if exists municipios";
               con.query(sql, function (err, result) {
                 if (err) throw err;
               });

             //Creamos la tabla
               sql = "create table municipios (id varchar(255), nombre varchar(255), latitud varchar(255), longitud varchar(255), habitantes int)";
               con.query(sql, function (err, result) {
                 if (err) throw err;
               });
             //Añadimos los valores
              var values=[];
               for (var i = 0; i < municipios.length; i++) {
                  values.push([`${municipios[i].id}`,`${municipios[i].nombre}`,`${municipios[i].latitud}`,`${municipios[i].longitud}`,`${municipios[i].num_hab}` ])
               }
               sql = "INSERT INTO municipios (id, nombre, latitud, longitud, habitantes) VALUES ?";
               con.query(sql,[values] ,function (err, result) {
                  if (err) throw err;
               });
                console.log('Municipios Actualizados');//Municipios Añadidos
         });

         //Introducir estaciones
         url = "https://opendata.aemet.es/opendata/api/valores/climatologicos/inventarioestaciones/todasestaciones?api_key=" + key;//URL para los municipios
         requestOptions  = { encoding: null, method: "GET", uri: url};
         request(requestOptions, function(error, response, body) {
           var res = iconv.decode(new Buffer(body), "ISO-8859-1");//Para que este en UTF-8
           res = JSON.parse(res);
           url = res.datos;//URL para los municipios
           requestOptions  = { encoding: null, method: "GET", uri: url};
           request(requestOptions, function(error, response, body) {
             var estaciones = iconv.decode(new Buffer(body), "ISO-8859-1");//Para que este en UTF-8
             estaciones = JSON.parse(estaciones);
             idemas = guardarIdemas(estaciones);//Lo utilizaremos para los datos de cada estacion
             //borramos la tabla existente
             sql = "DROP TABLE if exists estaciones";
             con.query(sql, function (err, result) {
               if (err) throw err;
             });
             //Creamos la tabla
             sql = "create table estaciones (id varchar(255), nombre varchar(255), latitud varchar(255), longitud varchar(255), altura int)";
             con.query(sql, function (err, result) {
               if (err) throw err;
             });
             //Añadimos los valores
             var values=[];
              for (var i = 0; i < estaciones.length; i++) {
                 values.push([`${estaciones[i].indicativo}`,`${estaciones[i].nombre}`,`${estaciones[i].latitud}`,`${estaciones[i].longitud}`,`${estaciones[i].altitud}` ])
              }
              sql = "INSERT INTO estaciones (id, nombre, latitud, longitud, altura) VALUES ?";
              con.query(sql,[values] ,function (err, result) {
                 if (err) throw err;
              });
               console.log('Estaciones Actualizadas');//Municipios Añadidos

               // Datos

                 url = "https://opendata.aemet.es/opendata/api/observacion/convencional/todas?api_key=" + key;//URL para los municipios
                 requestOptions  = { encoding: null, method: "GET", uri: url};
                 request(requestOptions, function(error, response, body) {
                   var datos = iconv.decode(new Buffer(body), "ISO-8859-1");//Para que este en UTF-8
                   datos = JSON.parse(datos);

                   url = datos.datos//URL para los municipios
                   requestOptions  = { encoding: null, method: "GET", uri: url};
                   request(requestOptions, function(error, response, body) {
                     var datos = iconv.decode(new Buffer(body), "ISO-8859-1");//Para que este en UTF-8
                     datos = JSON.parse(datos);


                     //Borramos
                     sql = "DROP TABLE if exists datos";
                     con.query(sql, function (err, result) {
                       if (err) throw err;
                     });
                     //Creamos la tabla
                     sql = "create table datos (id varchar(255), ubicacion varchar(255), fechahora varchar(255), temperatura varchar(255))";
                     con.query(sql, function (err, result) {
                       if (err) throw err;
                     });


                     var estaciones = [];
                     con.query("SELECT * FROM datos", function (err, result, fields) {
                       if (err) throw err;
                       estaciones = result;
                     });
                     for (var i = 0; i < datos.length; i++) {
                      // if (noEsta(estaciones, datos[i]) === true) {
                         var values=[];//Datos a introducir en la BBDD
                         values.push([`${datos[i].idema}`,`${datos[i].ubi}`,`${datos[i].fint}`,`${datos[i].ta}`])
                         sql = "INSERT INTO datos (id, ubicacion, fechahora, temperatura) VALUES ?";
                         con.query(sql,[values] ,function (err, result) {
                            if (err) throw err;
                         });
                      // }
                     }
                     console.log('Datos Actualizados');
                   //borramos la tabla existente
                   //Creamos la tabla
                   //Añadimos los valores
                 });//fin segunda consulta datos
               });//fin primera consulta datos
           });
         });
       resp.status(200);
       resp.send('Actualizado (esta operación puede tardar unos minutos...)');
     }else {
        resp.send('Wrong key');
     }

  });

});

function guardarIdemas(estaciones){
  var id = [];
  for (var i = 0; i < estaciones.length; i++) {
    id.push(estaciones[i].indicativo);
  }
  return id;
}
function noEsta(estaciones, estacion){
  var esta = false;
  for (var i = 0; i < estaciones.length; i++) {
    if (estaciones[i].id === estacion.idema) {
      esta = true;
    }
  }
  return esta;
}

var server = app.listen(8080, function () {
 console.log('Servidor iniciado en puerto 8080…');
});
