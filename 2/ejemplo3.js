var express = require("express");
var mysql = require('mysql');
var app = express();
var bp = require('body-parser');
var request = require('request');//Para hacer peticiones GET
var iconv = require('iconv-lite');//Para UTF-8

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
//Ejemplo: GET http://localhost:8080/usuarios
app.get('/usuarios', function(req, resp) {
  con.query('select * from usuarios', function(err, rows) {
    if (err) {
      console.log('Error en /usuarios '+err);
      resp.status(500);
      resp.send({message: "Error al obtener usuarios"});
    }
    else {
      console.log('/usuarios');
      resp.status(200);
      resp.send(rows);
    }
  })
});

app.get('/municipios', function(req, resp) {

});
app.get('/estaciones', function(req, resp) {

});
app.get('/observacion', function(req, resp) {

});
app.get('/introducirDatos', function(req, resp) {
//Introducir municipios

    var datos;
    var key = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiYW55dWxzOThAZ21haWwuY29tIiwianRpIjoiYzQ3YzgyMzMtYzhjOC00OWQ5LTk0NzYtMDg2ZTczZGNmNDBjIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE1Mzc5NDcwMDksInVzZXJJZCI6ImM0N2M4MjMzLWM4YzgtNDlkOS05NDc2LTA4NmU3M2RjZjQwYyIsInJvbGUiOiIifQ.1Km6vaOtp-mmugfFkPhDYxziK_MZGdCAZG71Mi1ibJw';
    var url = "https://opendata.aemet.es/opendata/api/maestro/municipios?api_key=" + key;//URL para los municipios
    var municipios;
    var requestOptions  = { encoding: null, method: "GET", uri: url};
    request(requestOptions, function(error, response, body) {
        var municipios = iconv.decode(new Buffer(body), "ISO-8859-1");//Para que este en UTF-8
        municipios = JSON.parse(municipios);
         var sql;
         var values=[];
          for (var i = 0; i < municipios.length; i++) {
             values.push([`${municipios[i].nombre}`,`${municipios[i].latitud}`,`${municipios[i].longitud}`,`${municipios[i].num_hab}` ])
          }
          con.connect(function(err) {
             if (err) throw err;
             sql = "INSERT INTO municipios (nombre, latitud, longitud, habitantes) VALUES ?";
             con.query(sql,[values] ,function (err, result) {
               if (err) throw err;
             });
           });
           console.log('Municipios Añadidos');//Municipios Añadidos
    });



//Introducir estaciones

//Introducir observacion
  resp.status(200);
  resp.send('Actualizado');
});


var server = app.listen(8080, function () {
 console.log('Servidor iniciado en puerto 8080…');
});
