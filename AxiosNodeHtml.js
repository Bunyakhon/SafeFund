require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
var bodyParser = require('body-parser');
const path = require("path");

const backend_port = process.env.PORT || 3000;
const base_url = `http://localhost:${backend_port}`;

const frontend_port = process.env.FRONTEND_PORT || 5500;

app.set("views", path.join(__dirname, "/public/views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

app.get("/", async (req, res) => {
    try {
        const response = await axios.get(base_url + '/members');
        res.render("members", { members: response.data });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});



app.listen(frontend_port, () => {
    console.log(`BackEnd SafeFund Run http://localhost:${frontend_port}/members-dashboard`);
});