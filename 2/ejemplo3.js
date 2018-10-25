var express = require("express");
var mysql = require('mysql');
var app = express();
var bp = require('body-parser');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest; //Linea necesaria para hacer un XHMLrequest en Node.js
const cors = require('cors');
app.use(cors());
app.options('*', cors());
app.use(bp.json());
var con = mysql.createConnection({
 host : '127.0.0.1',
 user : 'root',
 password : 'root',
 database : 'dism',
 port: '3311'
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

    //Peticion para obtener municipios a aemet
    var datos;
    var key = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiYW55dWxzOThAZ21haWwuY29tIiwianRpIjoiYzQ3YzgyMzMtYzhjOC00OWQ5LTk0NzYtMDg2ZTczZGNmNDBjIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE1Mzc5NDcwMDksInVzZXJJZCI6ImM0N2M4MjMzLWM4YzgtNDlkOS05NDc2LTA4NmU3M2RjZjQwYyIsInJvbGUiOiIifQ.1Km6vaOtp-mmugfFkPhDYxziK_MZGdCAZG71Mi1ibJw';
    let xhr = new XMLHttpRequest();
    var url = "https://opendata.aemet.es/opendata/api/maestro/municipios?api_key=" + key;
    var municipios;
  	xhr.open('GET',url, true);
  	xhr.onload = function(){
      municipios =JSON.parse(xhr.responseText);
      console.log(municipios[2]);
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
    };//Fin de xhr.onload
    xhr.send();


//Introducir estaciones

//Introducir observacion
  resp.status(200);
  resp.send('Actualizado');
});


var server = app.listen(8080, function () {
 console.log('Servidor iniciado en puerto 8080…');
});
