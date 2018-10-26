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
  con.query("SELECT * FROM municipios", function (err, result, fields) {
    if (err) throw err;
    resp.status(200);
    resp.send(result);
  });

});
app.get('/estaciones', function(req, resp) {
  con.query("SELECT * FROM estaciones", function (err, result, fields) {
    if (err) throw err;
    resp.status(200);
    resp.send(result);
  });
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
    var sql;
    request(requestOptions, function(error, response, body) {
        var municipios = iconv.decode(new Buffer(body), "ISO-8859-1");//Para que este en UTF-8
        municipios = JSON.parse(municipios);//Lista de todos los municipios de AEMET
        //borramos la tabla existente
          sql = "DROP TABLE municipios";
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
        //borramos la tabla existente
        sql = "DROP TABLE estaciones";
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
      });
    });

    //Introducir observacion
    url = "https://opendata.aemet.es/opendata/api/valores/climatologicos/inventarioestaciones/todasestaciones?api_key=" + key;//URL para los municipios
    requestOptions  = { encoding: null, method: "GET", uri: url};
    request(requestOptions, function(error, response, body) {
      var res = iconv.decode(new Buffer(body), "ISO-8859-1");//Para que este en UTF-8


      //borramos la tabla existente
      //Creamos la tabla
      //Añadimos los valores
    });

  resp.status(200);
  resp.send('Actualizado');
});


var server = app.listen(8080, function () {
 console.log('Servidor iniciado en puerto 8080…');
});
