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

app.get("/create-member", (req, res) => {
    res.render("create_member"); 
});
app.post("/create-member", async (req, res) => {
    try {
        const newMemberData = {
            member_name: req.body.member_name,
            address: req.body.address,
            phone: req.body.phone
        };
        
        await axios.post(base_url + '/members', newMemberData);
        res.redirect("/members-dashboard"); 
    } catch (err) {
        console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", err.message);
        res.status(500).send('Error Create Member');
    }
});

app.listen(frontend_port, () => {
    console.log(`BackEnd SafeFund Run http://localhost:${frontend_port}/`);
});