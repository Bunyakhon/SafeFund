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
        res.redirect("/"); 
    } catch (err) {
        console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", err.message);
        res.status(500).send('Error Create Member');
    }
});
app.get("/delete-member/:id", async (req, res) => {
    try {
        const memberId = req.params.id;
        await axios.delete(base_url + '/members/' + memberId);
        res.redirect("/");
    } catch (err) {
        console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", err.message);
        res.status(500).send('Error Delete Member');
    }
});
app.get("/edit-member/:id", async (req, res) => {
    try {
        const response = await axios.get(base_url + '/members/' + req.params.id);
        res.render("edit_member", { member: response.data });
    } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสมาชิก:", err.message);
        res.status(500).send('Error Load Edit Page');
    }
});
app.post("/update-member/:id", async (req, res) => {
    try {
        const updateData = {
            member_name: req.body.member_name,
            phone: req.body.phone,
            address: req.body.address
        };

        await axios.put(base_url + '/members/' + req.params.id, updateData);
        res.redirect("/");
    } catch (err) {
        console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล:", err.message);
        res.status(500).send('Error Update Member');
    }
});


app.get("/loans", async (req, res) => {
    try {
        const response = await axios.get(base_url + '/loans');
        res.render("loans", { loans: response.data });
    } catch (err) {
        console.error(err);
        res.render("loans", { loans: [] });
    }
});
app.listen(frontend_port, () => {
    console.log(`BackEnd SafeFund Run http://localhost:${frontend_port}/`);
});


// 1. หน้าแสดงฟอร์มสร้างสัญญา (ดึงสมาชิกไปให้เลือก)
app.get("/create-loan", async (req, res) => {
    try {
        const response = await axios.get(base_url + '/members');
        res.render("create_loan", { members: response.data });
    } catch (err) {
        console.error("Error fetching members:", err.message);
        res.render("create_loan", { members: [] });
    }
});

app.post("/create-loan", async (req, res) => {
    try {
        const newLoan = {
            member_id: req.body.member_id,
            loan_amount: req.body.loan_amount,
            interest_rate: req.body.interest_rate,
            duration_months: req.body.duration_months,
            status: req.body.status
        };
        
        await axios.post(base_url + '/loans', newLoan);
        res.redirect("/loans"); 
    } catch (err) {
        console.error("Error creating loan:", err.message);
        res.status(500).send('Error Create Loan');
    }
});
app.get("/edit-loan/:id", async (req, res) => {
    try {
        // ดึงข้อมูลสัญญาที่จะแก้ไข และ ดึงรายชื่อสมาชิกทั้งหมดเพื่อเอาไปให้เลือกใน Select Box
        const loanRes = await axios.get(base_url + '/loans/' + req.params.id);
        const membersRes = await axios.get(base_url + '/members');
        
        res.render("edit_loan", { 
            loan: loanRes.data, 
            members: membersRes.data 
        });
    } catch (err) {
        console.error("Error fetching loan data:", err.message);
        res.status(500).send('Error Load Loan Edit Page');
    }
});

app.post("/update-loan/:id", async (req, res) => {
    try {
        const updateLoanData = {
            member_id: req.body.member_id,
            loan_amount: req.body.loan_amount,
            interest_rate: req.body.interest_rate,
            duration_months: req.body.duration_months,
            status: req.body.status
        };

        await axios.put(base_url + '/loans/' + req.params.id, updateLoanData);
        res.redirect("/loans");
    } catch (err) {
        console.error("Error updating loan:", err.message);
        res.status(500).send('Error Update Loan');
    }
});
app.get("/delete-loan/:id", async (req, res) => {
    try {
        const loanId = req.params.id;
        await axios.delete(base_url + '/loans/' + loanId);
        res.redirect("/loans"); 
    } catch (err) {
        console.error("Error Delete Loan:", err.message);
        res.status(500).send('Error Delete Loan');
    }
});