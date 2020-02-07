const express = require('express')
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken');
var axios = require('axios');

const app = express()

app.use(bodyParser.json())
app.use((req, res, next) => {
    if (req.originalUrl.indexOf('/auth') == -1 && req.originalUrl.indexOf('/beforelogin') == -1) {
        console.log(req.headers["authorization"]);
        try {
            result = jwt.verify(req.headers["authorization"], "masterkey")
            req.role = result.role;
            console.log(result)
        } catch (ex) {
            console.log(ex);
            return res.status(401).send({ msg: "unauthorized access" });
        }
    }
    next()
})
function getDataFromAPI() {
    return new Promise(async (resolve, reject) => {
        try {
            var response = await axios.get("https://reqres.in/api/users/2")
            resolve(response.data);
        } catch (ex) {
            reject(ex);
        }
    })
}
function checkrole(req, res, next) {
    switch (req.originalUrl) {
        case "/": {
            if (req.role !== "admin")
                return res.status(401).send({ msg: "you don't authorize to use this route" })
        } break;
        case "/afterlogin": {
            if (req.role !== "user")
                return res.status(401).send({ msg: "you don't authorize to use this route" })
        } break;

    }
    next()
}
//get, post, put, delete, option
app.get('/', checkrole, async (req, res) => {
    var p = await getDataFromAPI()
    console.log(p)
    // console.log(response.data);
    res.send('Hello World and current role is ' + req.role)
})
app.get('/beforelogin', (req, res) => {
    res.send('hello from before login')
})
app.get('/afterlogin', checkrole, (req, res) => {
    res.send('hello from after login')
})
app.post('/auth', (req, res) => {
    var token = jwt.sign({ username: req.body.username, role: "user" }, 'masterkey');
    res.send({ token: token });
})
app.get('*', (req, res) => {
    res.send('not found')
})
app.listen(3000)