const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

app.use(bodyParser.json())

app.get('/auth', (req, res) => {
    res.send('Hello World');
}
);

app.use((req, res, next) => {
    if (req.originalUrl.indexOf('/token') == -1 && req.originalUrl.indexOf('/') == -1) {
        console.log(req.headers["authorization"]);
        try {
            result = jwt.verify(req.headers["authorization"], "masterkey")
            req.role = result.role;
            console.log(result)
        } catch (ex) {
            console.log(ex);
            return res.status(401).send(
                { msg: "Unauthorized Access" }
            );
        }
    }
    next();
}
);

function foo() {
    return new Promise(async (resolve, reject) => {
        try {
            var y = 5 / 0;
            console.log("Try statement");
            resolve(y);
        } catch (ex) {
            console.log("Catch Statement");
            reject(y);
        }
    }
    )
};

app.get('/foos', async (req, res) => {
    var p = await foo().then(data => {
        data = "Vicky"
        return data;
    }
    );
    console.log(p);
    res.send(p);
}
);

app.post('/token', (req, res) => {
    console.log(req.body.username);
    var token = jwt.sign({ username: req.body.username, role: "user" }, 'masterkey');
    res.send(JSON.stringify(token));
    console.log(token);
}
);

app.get('/beforelogin', (req, res) => {
    res.send('This is not for you kiddo');
}
);

function checkrole(req, res, next) {
    switch (req.originalUrl) {
        case "/": {
            if (req.role !== "admin")
                return res.status(401).send({ msg: "you are not authorized to use this route" })
        } break;
        case "/afterlogin": {
            if (req.role !== "user")
                return res.status(401).send({ msg: "you are not authorized to use this route" })
        } break;
    }
    next()
};

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

app.get('/', checkrole, async (req, res) => {
    var p = await getDataFromAPI()
    console.log(p)
    // console.log(response.data);
    res.send('Hello your current role is ' + req.role)
}
);

app.get('/afterlogin', checkrole, (req, res) => {
    res.send('After login Homepage')
}
);

app.get('/test', checkrole, async (req, res) => {
    var p = await getDataFromAPI()
    console.log(p)
    // console.log(response.data);
    res.send('Hello your current role is ' + req.role)
}
);

function prototype() {
    return "Vicky";
};

app.get('/prototype', (req, res) => {
    var a = prototype();
    res.send(a);
}
);

function abcd() {
    return 1;
};

app.get('/abcd', async (req, res) => {
    var b = await (abcd());
    var c = b.toString();
    res.send(c);
}
);

app.get('*', (req, res) => {
    res.send('not found')
}
);

app.listen(3000);
