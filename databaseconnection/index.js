const express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'my_db'
});

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
db.connect();

//SELECT
app.get('/users', (req, res) => {
  db.query('SELECT * FROM Login', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'credentials' });
  });
});

//SELECT WHERE
app.get('/users1', (req, res) => {
  db.query('SELECT * FROM Login WHERE ID = 1', (error, results) => {
    if (error) throw error;
    res.send(JSON.stringify(results));
  });
});

//INSERT
app.post('/user2', (req, res) => {
  let data = { ID: req.body.ID, Username: req.body.Username, Password: req.body.Password };
  db.query("INSERT INTO Login SET ?", data, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify(results));
  });
});

//UPDATE
app.put('/user3', (req, res) => {
  db.query("UPDATE Login SET Username = 'root' WHERE Username = 'admin'", (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify(results));
  });
});

//DELETE
app.delete('/user4', (req, res) => {
  db.query("DELETE FROM Login WHERE ID = '4'", (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify(results));
  });
});

//CREATE
app.post('/user5', (req, res) => {
  db.query("CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))", (err, results) => {
    if (err) throw err;
    console.log("Table created");
  })
})

//DROP
app.delete('/user6', (req, res) => {
  db.query("DROP TABLE customers", (err, results) => {
    if (err) throw err;
    console.log("Table removed");
  })
});

//ORDER BY
app.get('user7', (req, res) => {
  db.query("SELECT*FROM Login ORDER BY Username", (err,results) => {
    if (err) throw err;
    res.send(JSON.stringify(results));
  })
})

app.listen(3000);