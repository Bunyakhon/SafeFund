require('dotenv').config();//ใช้แพ็กเกจ dotenv ไว้ใน process.env
const express = require('express');//สร้างตัวแปร express เพื่อเรียกใช้งาน Express.js
const axios = require('axios'); //สร้างตัวแปร axios เพื่อเรียกใช้งาน axios
const app = express();//สร้างตัวแปร app เพื่อใช้งาน Express.js

var bodyParser = require('body-parser'); //สร้างตัวแปร bodyParser เพื่อเรียกใช้งาน body-parser ซึ่งช่วยในการแปลงข้อมูลที่ส่งมาจากฟอร์มให้เป็นรูปแบบที่สามารถใช้งานได้ใน Node.js
const path = require("path");//สร้างตัวแปร path เพื่อเรียกใช้งานโมดูล path ซึ่งช่วยในการจัดการเส้นทางของไฟล์และโฟลเดอร์ในระบบปฏิบัติการ

const backend_port = process.env.PORT || 3000; //สร้างตัวแปร backend_port เพื่อเก็บหมายเลขพอร์ตที่ Backend ใช้งาน 
// โดยจะใช้ค่าจาก environment variable PORT หากมีการกำหนดไว้ หรือใช้ค่าเริ่มต้นเป็น 3000 หากไม่มีการกำหนด
const base_url = `http://localhost:${backend_port}`;//สร้างตัวแปร base_url เพื่อเก็บ URL พื้นฐานของ Backend 
// ซึ่งจะใช้ในการเรียก API ต่างๆ จาก Frontend โดยอ้างอิงหมายเลขพอร์ตที่กำหนดใน backend_port

const frontend_port = process.env.FRONTEND_PORT || 5500; //สร้างตัวแปร frontend_port เพื่อเก็บหมายเลขพอร์ตที่ Frontend ใช้งาน

app.set("views", path.join(__dirname, "/public/views"));//กำหนดตำแหน่งของโฟลเดอร์ที่เก็บไฟล์ EJS โดยใช้ path.join เพื่อรวมเส้นทางของโฟลเดอร์ "views" 
//                                                          ที่อยู่ภายในโฟลเดอร์ "public" กับ __dirname ซึ่งเป็นตัวแปรที่เก็บเส้นทางของไฟล์ปัจจุบัน
app.set("view engine", "ejs");//กำหนดให้ใช้ EJS เป็น template engine สำหรับการเรนเดอร์หน้า HTML ใน Express.js
app.use(bodyParser.json());//ใช้ bodyParser.json() เพื่อแปลงข้อมูลที่ส่งมาจากฟอร์มในรูปแบบ JSON ให้เป็นวัตถุ JavaScript ที่สามารถใช้งานได้ใน Node.js
app.use(bodyParser.urlencoded({ extended: false }));//ใช้ bodyParser.urlencoded() เพื่อแปลงข้อมูลที่ส่งมาจากฟอร์มในรูปแบบ URL-encoded 
//                                                      ให้เป็นวัตถุ JavaScript ที่สามารถใช้งานได้ใน Node.js

app.use(express.static(__dirname + '/public'));//ใช้ express.static() เพื่อให้ Express.js สามารถให้บริการไฟล์สาธารณะ (static files) 
// เช่น CSS, JavaScript, รูปภาพ ฯลฯ ที่อยู่ในโฟลเดอร์ "public" ได้

app.get("/", async (req, res) => {//กำหนดเส้นทางสำหรับหน้าแรก ("/") ของเว็บไซต์ โดยใช้ HTTP GET method เมื่อมีการเข้าถึงเส้นทางนี้จะทำงานในบล็อกนี้
    try {//ใช้ try-catch เพื่อจัดการกับข้อผิดพลาดที่อาจเกิดขึ้นในขั้นตอนการดึงข้อมูลสมาชิกจาก Backend
        const response = await axios.get(base_url + '/members');//ใช้ axios เพื่อส่งคำขอ GET ไปยัง API ที่อยู่ใน Backend เพื่อดึงข้อมูลสมาชิกทั้งหมด
        res.render("members", { members: response.data });//เมื่อได้รับข้อมูลสมาชิกจาก Backend แล้ว จะใช้ res.render() เพื่อเรนเดอร์หน้า EJS ชื่อ "members" 
        //                                                  และส่งข้อมูลสมาชิกที่ดึงมาได้ผ่านตัวแปร members ไปยังหน้า EJS นั้น
    } catch (err) {//เมื่อเกิดข้อผิดพลาดในการดึงข้อมูลสมาชิกจาก Backend จะทำงานในบล็อกนี้
        console.error(err);//แสดงข้อความข้อผิดพลาดใน console เพื่อช่วยในการดีบัก
        res.status(500).send('Error');//ส่งสถานะ HTTP 500 พร้อมข้อความ "Error" กลับไปยัง client เพื่อแจ้งว่าเกิดข้อผิดพลาดในการดึงข้อมูลสมาชิก
    }
});

app.get("/create-member", (req, res) => {//กำหนดเส้นทางสำหรับหน้า "/create-member" ของเว็บไซต์ โดยใช้ HTTP GET method เมื่อมีการเข้าถึงเส้นทางนี้จะทำงานในบล็อกนี้
    res.render("create_member"); //ใช้ res.render() เพื่อเรนเดอร์หน้า EJS ชื่อ "create_member" ซึ่งเป็นหน้าฟอร์มสำหรับสร้างสมาชิกใหม่
});
app.post("/create-member", async (req, res) => {//กำหนดเส้นทางสำหรับการสร้างสมาชิกใหม่ที่ "/create-member" ของเว็บไซต์ 
// โดยใช้ HTTP POST method เมื่อมีการส่งข้อมูลจากฟอร์มในหน้า "create_member" จะทำงานในบล็อกนี้
    try {
        const newMemberData = {//สร้างตัวแปร newMemberData เพื่อเก็บข้อมูลสมาชิกใหม่ที่ได้รับจากฟอร์ม โดยดึงค่าจาก req.body ซึ่งเป็นข้อมูลที่ส่งมาจากฟอร์ม
            member_name: req.body.member_name,// ดึงค่าชื่อสมาชิกจากฟอร์ม
            address: req.body.address,// ดึงค่าที่อยู่จากฟอร์ม
            phone: req.body.phone// ดึงค่าเบอร์โทรศัพท์จากฟอร์ม
        };
        
        await axios.post(base_url + '/members', newMemberData);//ใช้ axios เพื่อส่งคำขอ POST ไปยัง API ที่อยู่ใน Backend เพื่อสร้างสมาชิกใหม่ 
        // โดยส่งข้อมูลสมาชิกใหม่ที่เก็บไว้ใน newMemberData ไปยัง API
        res.redirect("/"); //เมื่อสร้างสมาชิกใหม่สำเร็จแล้ว ให้ใช้ res.redirect() เพื่อเปลี่ยนเส้นทางกลับไปที่หน้าแรก ("/") ซึ่งจะแสดงรายการสมาชิกทั้งหมดรวมถึงสมาชิกใหม่ที่เพิ่งสร้างขึ้น
    } catch (err) {//เมื่อเกิดข้อผิดพลาดในการสร้างสมาชิกใหม่จะทำงานในบล็อกนี้
        console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", err.message);//แสดงข้อความข้อผิดพลาดใน console เพื่อช่วยในการดีบัก
        res.status(500).send('Error Create Member');//ส่งสถานะ HTTP 500 พร้อมข้อความ "Error Create Member" กลับไปยัง client เพื่อแจ้งว่าเกิดข้อผิดพลาดในการสร้างสมาชิกใหม่
    }
});
app.get("/delete-member/:id", async (req, res) => {//กำหนดเส้นทางสำหรับการลบสมาชิกที่ "/delete-member/:id" ของเว็บไซต์ โดยใช้ HTTP GET method
    try {
        const memberId = req.params.id;// ดึงค่า member_id ที่ต้องการลบจาก URL ผ่านตัวแปร req.params.id
        await axios.delete(base_url + '/members/' + memberId)// ใช้ axios เพื่อส่งคำขอ DELETE ไปยัง API ที่อยู่ใน Backend เพื่อทำการลบสมาชิกที่มี member_id ตามที่ระบุใน URL
        res.redirect("/");//เมื่อการลบสมาชิกสำเร็จแล้ว ให้ใช้ res.redirect() เพื่อเปลี่ยนเส้นทางกลับไปที่หน้าแรก ("/") ซึ่งจะแสดงรายการสมาชิกทั้งหมดโดยไม่รวมสมาชิกที่ถูกลบออกไป
    } catch (err) {
        console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", err.message);//แสดงข้อความข้อผิดพลาดใน console เพื่อช่วยในการดีบัก
        res.status(500).send('Error Delete Member');//ส่งสถานะ HTTP 500 พร้อมข้อความ "Error Delete Member" กลับไปยัง client เพื่อแจ้งว่าเกิดข้อผิดพลาดในการลบสมาชิก
    }
});
app.get("/edit-member/:id", async (req, res) => {
    try {// ดึงข้อมูลสมาชิกที่ต้องการแก้ไขจาก Backend โดยใช้ member_id ที่ระบุใน URL ผ่านตัวแปร req.params.id
        const response = await axios.get(base_url + '/members/' + req.params.id);// ใช้ axios เพื่อส่งคำขอ GET ไปยัง API ที่อยู่ใน Backend เพื่อดึงข้อมูลสมาชิกที่มี member_id ตามที่ระบุใน URL
        res.render("edit_member", { member: response.data });//เมื่อได้รับข้อมูลสมาชิกจาก Backend แล้ว จะใช้ res.render() เพื่อเรนเดอร์หน้า EJS ชื่อ "edit_member"
    } catch (err) {//เมื่อเกิดข้อผิดพลาดในการดึงข้อมูลสมาชิกสำหรับหน้าแก้ไขจะทำงานในบล็อกนี้
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสมาชิก:", err.message);//แสดงข้อความข้อผิดพลาดใน console เพื่อช่วยในการดีบัก
        res.status(500).send('Error Load Edit Page');//ส่งสถานะ HTTP 500 พร้อมข้อความ "Error Load Edit Page" กลับไปยัง client 
        // เพื่อแจ้งว่าเกิดข้อผิดพลาดในการดึงข้อมูลสมาชิกสำหรับหน้าแก้ไข
    }
});
app.post("/update-member/:id", async (req, res) => {//กำหนดเส้นทางสำหรับการอัปเดตข้อมูลสมาชิกที่ "/update-member/:id" ของเว็บไซต์ 
//                                                  โดยใช้ HTTP POST method เมื่อมีการส่งข้อมูลจากฟอร์มในหน้า "edit_member" จะทำงานในบล็อกนี้
    try {
        const updateData = {
            member_name: req.body.member_name,// ดึงค่าชื่อสมาชิกใหม่จากฟอร์ม
            phone: req.body.phone,// ดึงค่าเบอร์โทรศัพท์ใหม่จากฟอร์ม
            address: req.body.address// ดึงค่าที่อยู่ใหม่จากฟอร์ม
        };

        await axios.put(base_url + '/members/' + req.params.id, updateData);//ใช้ axios เพื่อส่งคำขอ PUT ไปยัง API ที่อยู่ใน Backend 
        // เพื่อทำการอัปเดตข้อมูลสมาชิกที่มี member_id ตามที่ระบุใน URL โดยส่งข้อมูลใหม่ที่เก็บไว้ใน updateData ไปยัง API
        res.redirect("/");//เมื่อการอัปเดตข้อมูลสมาชิกสำเร็จแล้ว ให้ใช้ res.redirect() 
        // เพื่อเปลี่ยนเส้นทางกลับไปที่หน้าแรก ("/") ซึ่งจะแสดงรายการสมาชิกทั้งหมดโดยมีข้อมูลที่ถูกแก้ไขแล้ว
    } catch (err) {
        console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล:", err.message);//แสดงข้อความข้อผิดพลาดใน console 
        res.status(500).send('Error Update Member');//ส่งสถานะ HTTP 500 พร้อมข้อความ "Error Update Member" กลับไปยัง client เพื่อแจ้งว่าเกิดข้อผิดพลาดในการอัปเดตข้อมูลสมาชิก
    }
});


app.get("/loans", async (req, res) => {//กำหนดเส้นทางสำหรับหน้า "/loans" ของเว็บไซต์ โดยใช้ HTTP GET method เมื่อมีการเข้าถึงเส้นทางนี้จะทำงานในบล็อกนี้
    try {
        const response = await axios.get(base_url + '/loans');//ใช้ axios เพื่อส่งคำขอ GET ไปยัง API ที่อยู่ใน Backend เพื่อดึงข้อมูลรายการเงินกู้ทั้งหมด
        res.render("loans", { loans: response.data });//เมื่อได้รับข้อมูลรายการเงินกู้จาก Backend แล้ว จะใช้ res.render() เพื่อเรนเดอร์หน้า EJS ชื่อ "loans"
    } catch (err) {
        console.error(err);//แสดงข้อความข้อผิดพลาดใน console เพื่อช่วยในการดีบัก
        res.render("loans", { loans: [] });//หากเกิดข้อผิดพลาดในการดึงข้อมูลรายการเงินกู้จาก Backend จะทำงานในบล็อกนี้ โดยจะเรนเดอร์หน้า "loans" 
        // แต่ส่งข้อมูล loans เป็นอาร์เรย์ว่างแทน เพื่อให้หน้าแสดงว่าไม่มีรายการเงินกู้
    }
});


// 1. หน้าแสดงฟอร์มสร้างสัญญา (ดึงสมาชิกไปให้เลือก)
app.get("/create-loan", async (req, res) => {//กำหนดเส้นทางสำหรับหน้า "/create-loan" ของเว็บไซต์ โดยใช้ HTTP GET method เมื่อมีการเข้าถึงเส้นทางนี้จะทำงานในบล็อกนี้
    try {
        const response = await axios.get(base_url + '/members');//ใช้ axios เพื่อส่งคำขอ GET ไปยัง API ที่อยู่ใน Backend เพื่อดึงข้อมูลสมาชิกทั้งหมด 
        //                                                      เพื่อให้สามารถเลือกสมาชิกได้ในฟอร์มสร้างสัญญา
        res.render("create_loan", { members: response.data });//เมื่อได้รับข้อมูลสมาชิกจาก Backend แล้ว จะใช้ res.render() 
        // เพื่อเรนเดอร์หน้า EJS ชื่อ "create_loan"
    } catch (err) {
        console.error("Error fetching members:", err.message);//แสดงข้อความข้อผิดพลาดใน console เพื่อช่วยในการดีบัก
        res.render("create_loan", { members: [] });//หากเกิดข้อผิดพลาดในการดึงข้อมูลสมาชิกจาก Backend จะทำงานในบล็อกนี้ โดยจะเรนเดอร์หน้า "create_loan"
    }
});

app.post("/create-loan", async (req, res) => {//กำหนดเส้นทางสำหรับการสร้างสัญญาเงินกู้ใหม่ที่ "/create-loan" ของเว็บไซต์ โดยใช้ HTTP POST method 
// เมื่อมีการส่งข้อมูลจากฟอร์มในหน้า "create_loan" จะทำงานในบล็อกนี้
    try {
        const newLoan = {//สร้างตัวแปร newLoan เพื่อเก็บข้อมูลสัญญาเงินกู้ใหม่ที่ได้รับจากฟอร์ม โดยดึงค่าจาก req.body ซึ่งเป็นข้อมูลที่ส่งมาจากฟอร์ม
            member_id: req.body.member_id,// ดึงค่า member_id จากฟอร์ม
            loan_amount: req.body.loan_amount,// ดึงค่า loan_amount จากฟอร์ม
            interest_rate: req.body.interest_rate,// ดึงค่า interest_rate จากฟอร์ม
            duration_months: req.body.duration_months,// ดึงค่า duration_months จากฟอร์ม
            status: req.body.status// ดึงค่า status จากฟอร์ม
        };
        
        await axios.post(base_url + '/loans', newLoan);//ใช้ axios เพื่อส่งคำขอ POST ไปยัง API ที่อยู่ใน Backend เพื่อสร้างสัญญาเงินกู้ใหม่
        //  โดยส่งข้อมูลสัญญาเงินกู้ใหม่ที่เก็บไว้ใน newLoan ไปยัง API
        res.redirect("/loans"); //เมื่อสร้างสัญญาเงินกู้ใหม่สำเร็จแล้ว ให้ใช้ res.redirect() เพื่อเปลี่ยนเส้นทางกลับไปที่หน้า "/loans" 
        // ซึ่งจะแสดงรายการเงินกู้ทั้งหมดรวมถึงสัญญาเงินกู้ใหม่ที่เพิ่งสร้างขึ้น
    } catch (err) {
        console.error("Error creating loan:", err.message);//แสดงข้อความข้อผิดพลาดใน console เพื่อช่วยในการดีบัก
        res.status(500).send('Error Create Loan');//ส่งสถานะ HTTP 500 พร้อมข้อความ "Error Create Loan" กลับไปยัง client เพื่อแจ้งว่าเกิดข้อผิดพลาดในการสร้างสัญญาเงินกู้ใหม่
    }
});
app.get("/edit-loan/:id", async (req, res) => {//กำหนดเส้นทางสำหรับหน้า "/edit-loan/:id" ของเว็บไซต์ โดยใช้ HTTP GET method เมื่อมีการเข้าถึงเส้นทางนี้จะทำงานในบล็อกนี้
    try {
        const loanRes = await axios.get(base_url + '/loans/' + req.params.id);//ใช้ axios เพื่อส่งคำขอ GET ไปยัง API ที่อยู่ใน Backend 
        //                      เพื่อดึงข้อมูลสัญญาเงินกู้ที่มี loan_id ตามที่ระบุใน URL ผ่านตัวแปร req.params.id
        const membersRes = await axios.get(base_url + '/members');//ใช้ axios เพื่อส่งคำขอ GET ไปยัง API ที่อยู่ใน Backend เพื่อดึงข้อมูลสมาชิกทั้งหมด
       
        const error = req.query.error; // รับค่า error จาก URL (ถ้ามี)

        res.render("edit_loan", { //เมื่อได้รับข้อมูลสัญญาเงินกู้และข้อมูลสมาชิกจาก Backend แล้ว จะใช้ res.render() เพื่อเรนเดอร์หน้า EJS ชื่อ "edit_loan"
            loan: loanRes.data, // ส่งข้อมูลสัญญาเงินกู้ที่ดึงมาได้ผ่านตัวแปร loan ไปยังหน้า EJS
            members: membersRes.data,// ส่งข้อมูลสมาชิกที่ดึงมาได้ผ่านตัวแปร members ไปยังหน้า EJS
            errorMessage: error === 'paid' ? 'ไม่สามารถแก้ไขรายละเอียดการเงินได้ เนื่องจากมีการชำระเงินเข้ามาแล้ว' : null// หากมีค่า error เท่ากับ 'paid' ให้ส่งข้อความแจ้งเตือนผ่านตัวแปร 
            //                  errorMessage ไปยังหน้า EJS เพื่อแสดงข้อความแจ้งเตือนในกรณีที่ไม่สามารถแก้ไขรายละเอียดการเงินได้เนื่องจากมีการชำระเงินเข้ามาแล้ว
        });
    } catch (err) {
        res.status(500).send('Error Load Loan Edit Page');//ส่งสถานะ HTTP 500 พร้อมข้อความ "Error Load Loan Edit Page" 
        //                                                  กลับไปยัง client เพื่อแจ้งว่าเกิดข้อผิดพลาดในการโหลดหน้าแก้ไขสัญญาเงินกู้
    }
});

app.post("/update-loan/:id", async (req, res) => {//กำหนดเส้นทางสำหรับการอัปเดตข้อมูลสัญญาเงินกู้ที่ "/update-loan/:id" ของเว็บไซต์ โดยใช้ HTTP POST method
    try {
        await axios.put(base_url + '/loans/' + req.params.id, req.body);//ใช้ axios เพื่อส่งคำขอ PUT ไปยัง API ที่อยู่ใน Backend 
        // เพื่อทำการอัปเดตข้อมูลสัญญาเงินกู้ที่มี loan_id ตามที่ระบุใน URL โดยส่งข้อมูลใหม่ที่ได้รับจากฟอร์มผ่าน req.body ไปยัง API
        res.redirect("/loans");//เมื่อการอัปเดตข้อมูลสัญญาเงินกู้สำเร็จแล้ว ให้ใช้ res.redirect() เพื่อเปลี่ยนเส้นทางกลับไปที่หน้า "/loans"
    } catch (err) {
        // หาก Backend ส่ง Error 400 กลับมา (กรณีมีการจ่ายเงินแล้ว)
        if (err.response && err.response.status === 400) {// ตรวจสอบว่า error response มีสถานะเป็น 400 ซึ่งหมายถึงไม่สามารถแก้ไขสัญญาเงินกู้ได้เนื่องจากมีการชำระเงินเข้ามาแล้ว
            // ส่งกลับไปที่หน้าเดิมพร้อมแนบ parameter error=paid
            return res.redirect(`/edit-loan/${req.params.id}?error=paid`);// เมื่อเกิดข้อผิดพลาดในการอัปเดตข้อมูลสัญญาเงินกู้และสถานะของข้อผิดพลาดเป็น 400 
            // ให้ใช้ res.redirect() เพื่อเปลี่ยนเส้นทางกลับไปที่หน้าแก้ไขสัญญาเงินกู้เดิม
        }
        res.status(500).send('Error Update Loan');//ส่งสถานะ HTTP 500 พร้อมข้อความ "Error Update Loan" กลับไปยัง client เพื่อแจ้งว่าเกิดข้อผิดพลาดในการอัปเดตข้อมูลสัญญาเงินกู้
    }
});
app.get("/delete-loan/:id", async (req, res) => {//กำหนดเส้นทางสำหรับการลบสัญญาเงินกู้ที่ "/delete-loan/:id" ของเว็บไซต์ โดยใช้ HTTP GET method
    try {
        const loanId = req.params.id;// ดึงค่า loan_id ที่ต้องการลบจาก URL ผ่านตัวแปร req.params.id
        await axios.delete(base_url + '/loans/' + loanId);// ใช้ axios เพื่อส่งคำขอ DELETE ไปยัง API ที่อยู่ใน Backend เพื่อทำการลบสัญญาเงินกู้ที่มี loan_id ตามที่ระบุใน URL
        res.redirect("/loans"); //เมื่อการลบสัญญาเงินกู้สำเร็จแล้ว ให้ใช้ res.redirect() เพื่อเปลี่ยนเส้นทางกลับไปที่หน้า "/loans" 
        //                        ซึ่งจะแสดงรายการเงินกู้ทั้งหมดโดยไม่รวมสัญญาเงินกู้ที่ถูกลบออกไป
    } catch (err) {
        console.error("Error Delete Loan:", err.message);//แสดงข้อความข้อผิดพลาดใน console เพื่อช่วยในการดีบัก
        res.status(500).send('Error Delete Loan');//ส่งสถานะ HTTP 500 พร้อมข้อความ "Error Delete Loan" กลับไปยัง client เพื่อแจ้งว่าเกิดข้อผิดพลาดในการลบสัญญาเงินกู้
    }
});

// หน้าแสดงรายการเงินฝาก
// 1. เพิ่มหน้าหลักเงินฝาก เพื่อให้แสดงเฉพาะรายชื่อสมาชิก
app.get("/savings", async (req, res) => {//กำหนดเส้นทางสำหรับหน้า "/savings" ของเว็บไซต์ โดยใช้ HTTP GET method เมื่อมีการเข้าถึงเส้นทางนี้จะทำงานในบล็อกนี้
    try {
        // ดึงข้อมูลสมาชิกทั้งหมด
        const membersRes = await axios.get(base_url + '/members');
        // ดึงข้อมูลเงินฝากทั้งหมดเพื่อนำไปคำนวณยอดรวมในหน้า EJS
        const savingsRes = await axios.get(base_url + '/savings'); 
        
        res.render("savings", { //เมื่อได้รับข้อมูลสมาชิกและข้อมูลเงินฝากจาก Backend แล้ว จะใช้ res.render() เพื่อเรนเดอร์หน้า EJS ชื่อ "savings"
            members: membersRes.data, // ส่งข้อมูลสมาชิกที่ดึงมาได้ผ่านตัวแปร members ไปยังหน้า EJS
            savings: savingsRes.data // ส่งข้อมูลเงินฝากที่ดึงมาได้ผ่านตัวแปร savings ไปยังหน้า EJS เพื่อใช้ในการคำนวณยอดรวมเงินฝากของแต่ละสมาชิก
        });
    } catch (err) {
        console.error("Error loading savings page:", err.message);//แสดงข้อความข้อผิดพลาดใน console เพื่อช่วยในการดีบัก
        res.render("savings", { members: [], savings: [] });//หากเกิดข้อผิดพลาดในการดึงข้อมูลสมาชิกหรือข้อมูลเงินฝากจาก Backend จะทำงานในบล็อกนี้ โดยจะเรนเดอร์หน้า "savings"
    }
});
app.get("/loan-history/:id", async (req, res) => {//กำหนดเส้นทางสำหรับหน้า "/loan-history/:id" ของเว็บไซต์ โดยใช้ HTTP GET method เมื่อมีการเข้าถึงเส้นทางนี้จะทำงานในบล็อกนี้
    try {
        const response = await axios.get(base_url + '/loans/' + req.params.id);//ใช้ axios เพื่อส่งคำขอ GET ไปยัง API ที่อยู่ใน Backend 
        //                                                                          เพื่อดึงข้อมูลสัญญาเงินกู้ที่มี loan_id ตามที่ระบุใน URL ผ่านตัวแปร req.params.id
        res.render("loan_history", { loan: response.data });//เมื่อได้รับข้อมูลสัญญาเงินกู้จาก Backend แล้ว จะใช้ res.render() เพื่อเรนเดอร์หน้า EJS ชื่อ "loan_history"
    } catch (err) {//เมื่อเกิดข้อผิดพลาดในการดึงข้อมูลสัญญาเงินกู้สำหรับหน้าแสดงประวัติการเงินกู้จะทำงานในบล็อกนี้
        console.error("Error loading loan history:", err.message);//แสดงข้อความข้อผิดพลาดใน console เพื่อช่วยในการดีบัก
        res.redirect("/loans");//เมื่อเกิดข้อผิดพลาดในการดึงข้อมูลสัญญาเงินกู้สำหรับหน้าแสดงประวัติการเงินกู้ ให้ใช้ res.redirect() เพื่อเปลี่ยนเส้นทางกลับไปที่หน้า "/loans"
    }
});
app.get("/confirm-payment/:payment_id/:loan_id", async (req, res) => {//กำหนดเส้นทางสำหรับการยืนยันการชำระเงินที่ "/confirm-payment/:payment_id/:loan_id" 
//                                                                          ของเว็บไซต์ โดยใช้ HTTP GET method
    try {
        const { payment_id, loan_id } = req.params;// ดึงค่า payment_id และ loan_id จาก URL ผ่านตัวแปร req.params
        // เรียก API ไปที่ Backend
        await axios.put(`${base_url}/payments/${payment_id}/confirm`);//ใช้ axios เพื่อส่งคำขอ PUT ไปยัง API ที่อยู่ใน Backend 
        //                                                              เพื่อทำการยืนยันการชำระเงินที่มี payment_id ตามที่ระบุใน URL
        // เมื่อสำเร็จ ให้กลับไปหน้าประวัติเดิม
        res.redirect("/loan-history/" + loan_id);//เมื่อการยืนยันการชำระเงินสำเร็จแล้ว ให้ใช้ res.redirect() เพื่อเปลี่ยนเส้นทางกลับไปที่หน้า "/loan-history/:id"
    } catch (err) {
        console.error("Error confirming payment:", err.message);//แสดงข้อความข้อผิดพลาดใน console เพื่อช่วยในการดีบัก
        res.status(500).send("ยืนยันการชำระเงินล้มเหลว");//ส่งสถานะ HTTP 500 พร้อมข้อความ "ยืนยันการชำระเงินล้มเหลว" กลับไปยัง client เพื่อแจ้งว่าเกิดข้อผิดพลาดในการยืนยันการชำระเงิน
    }
});

// 2. หน้าแสดงประวัติการฝากเงินเฉพาะบุคคล
app.get("/savings/history/:id", async (req, res) => {//กำหนดเส้นทางสำหรับหน้า "/savings/history/:id" ของเว็บไซต์ โดยใช้ HTTP GET method เมื่อมีการเข้าถึงเส้นทางนี้จะทำงานในบล็อกนี้
    try {
        
        //ใช้ axios เพื่อส่งคำขอ GET ไปยัง API ที่อยู่ใน Backend เพื่อดึงข้อมูลสมาชิกที่มี member_id ตามที่ระบุใน URL ผ่านตัวแปร req.params.id
        const memberRes = await axios.get(`${base_url}/members/${req.params.id}`);
        //ใช้ axios เพื่อส่งคำขอ GET ไปยัง API ที่อยู่ใน Backend เพื่อดึงข้อมูลรายการเงินฝากของสมาชิกที่มี member_id ตามที่ระบุใน URL ผ่านตัวแปร req.params.id
        const savingsRes = await axios.get(`${base_url}/members/${req.params.id}/savings`);
        
        res.render("saving_history", { //เมื่อได้รับข้อมูลสมาชิกและข้อมูลรายการเงินฝากจาก Backend แล้ว จะใช้ res.render() เพื่อเรนเดอร์หน้า EJS ชื่อ "saving_history"
            member: memberRes.data, // ส่งข้อมูลสมาชิกที่ดึงมาได้ผ่านตัวแปร member ไปยังหน้า EJS
            savings: savingsRes.data // ส่งข้อมูลรายการเงินฝากที่ดึงมาได้ผ่านตัวแปร savings ไปยังหน้า EJS เพื่อแสดงประวัติการฝากเงินของสมาชิกคนนั้น
        });
    } catch (err) { 
        console.error("Error loading history:", err.message);//แสดงข้อความข้อผิดพลาดใน console เพื่อช่วยในการดีบัก
        res.redirect("/savings"); //เมื่อเกิดข้อผิดพลาดในการดึงข้อมูลสมาชิกหรือข้อมูลรายการเงินฝากสำหรับหน้าแสดงประวัติการฝากเงิน 
        // ให้ใช้ res.redirect() เพื่อเปลี่ยนเส้นทางกลับไปที่หน้า "/savings"
    }
});

// 3. หน้าฟอร์มบันทึกการฝากเงินใหม่
app.get("/create-saving", async (req, res) => {//กำหนดเส้นทางสำหรับหน้า "/create-saving" ของเว็บไซต์ โดยใช้ HTTP GET method เมื่อมีการเข้าถึงเส้นทางนี้จะทำงานในบล็อกนี้
    try {
        // ดึงข้อมูลสมาชิกทั้งหมดเพื่อให้เลือกได้ในฟอร์ม และดึงข้อมูลเงินฝากทั้งหมดเพื่อคำนวณยอดรวมในหน้า EJS
        const membersRes = await axios.get(`${base_url}/members`);
        // ดึงข้อมูลเงินฝากทั้งหมดเพื่อนำไปคำนวณยอดรวมในหน้า EJS
        const savingsRes = await axios.get(`${base_url}/savings`); 
        
        res.render("create_saving", { //เมื่อได้รับข้อมูลสมาชิกและข้อมูลเงินฝากจาก Backend แล้ว จะใช้ res.render() เพื่อเรนเดอร์หน้า EJS ชื่อ "create_saving"
            members: membersRes.data, // ส่งข้อมูลสมาชิกที่ดึงมาได้ผ่านตัวแปร members ไปยังหน้า EJS เพื่อให้เลือกสมาชิกในฟอร์ม
            savings: savingsRes.data // ส่งข้อมูลเงินฝากที่ดึงมาได้ผ่านตัวแปร savings ไปยังหน้า EJS เพื่อใช้ในการคำนวณยอดรวมเงินฝากของแต่ละสมาชิกในฟอร์ม
        });
    } catch (err) {
        console.error(err);//แสดงข้อความข้อผิดพลาดใน console เพื่อช่วยในการดีบัก
        res.redirect("/savings");//เมื่อเกิดข้อผิดพลาดในการดึงข้อมูลสมาชิกหรือข้อมูลเงินฝากสำหรับหน้าแสดงฟอร์มบันทึกการฝากเงินใหม่ ใ
        // ห้ใช้ res.redirect() เพื่อเปลี่ยนเส้นทางกลับไปที่หน้า "/savings"
    }
});
// 4. บันทึกข้อมูลฝากเงิน
app.post("/create-saving", async (req, res) => {//กำหนดเส้นทางสำหรับการสร้างรายการเงินฝากใหม่ที่ "/create-saving" ของเว็บไซต์ 
//                                                  โดยใช้ HTTP POST method เมื่อมีการส่งข้อมูลจากฟอร์มในหน้า "create_saving" จะทำงานในบล็อกนี้
    try {
        //ใช้ axios เพื่อส่งคำขอ POST ไปยัง API ที่อยู่ใน Backend เพื่อสร้างรายการเงินฝากใหม่ โดยส่งข้อมูลที่ได้รับจากฟอร์มผ่าน req.body ไปยัง API
        await axios.post(`${base_url}/savings`, req.body);
        // เมื่อบันทึกเสร็จ ให้เด้งกลับไปหน้าประวัติของสมาชิกคนนั้นทันที
        res.redirect("/savings/history/" + req.body.member_id);
    } catch (err) {
        res.status(500).send("บันทึกข้อมูลไม่สำเร็จ");////ใช้ axios เพื่อส่งคำขอ POST ไปยัง API ที่อยู่ใน Backend เพื่อสร้างรายการเงินฝากใหม่ โดยส่งข้อมูลที่ได้รับจากฟอร์มผ่าน req.body ไปยัง API
    }
});
// 1. หน้าแสดงฟอร์มแก้ไขเงินฝาก
app.get("/edit-saving/:id", async (req, res) => {//กำหนดเส้นทางสำหรับหน้า "/edit-saving/:id" ของเว็บไซต์ โดยใช้ HTTP GET method เมื่อมีการเข้าถึงเส้นทางนี้จะทำงานในบล็อกนี้
    try {
        // ดึงข้อมูลรายการเงินฝากพร้อมชื่อสมาชิก
        const response = await axios.get(`${base_url}/savings/${req.params.id}`);
        // ดึงข้อมูลสมาชิกทั้งหมดเพื่อให้เลือกได้ในฟอร์ม และดึงข้อมูลเงินฝากทั้งหมดเพื่อคำนวณยอดรวมในหน้า EJS
        res.render("edit_saving", { saving: response.data });
    } catch (err) {
        console.error("Error loading edit saving page:", err.message);//แสดงข้อความข้อผิดพลาดใน console เพื่อช่วยในการดีบัก
        res.redirect("/savings");//เมื่อเกิดข้อผิดพลาดในการดึงข้อมูลรายการเงินฝากสำหรับหน้าแก้ไข ให้ใช้ res.redirect() เพื่อเปลี่ยนเส้นทางกลับไปที่หน้า "/savings"
    }
});

// 2. จัดการการอัปเดตข้อมูล
app.post("/update-saving/:id", async (req, res) => {//กำหนดเส้นทางสำหรับการอัปเดตข้อมูลรายการเงินฝากที่ "/update-saving/:id" ของเว็บไซต์ โดยใช้ HTTP POST method เมื่อมีการส่งข้อมูลจากฟอร์มในหน้า "edit_saving" จะทำงานในบล็อกนี้
    try {
        //ใช้ axios เพื่อส่งคำขอ PUT ไปยัง API ที่อยู่ใน Backend เพื่อทำการอัปเดตข้อมูลรายการเงินฝากที่มี saving_id ตามที่ระบุใน URL โดยส่งข้อมูลใหม่ที่ได้รับจากฟอร์มผ่าน req.body ไปยัง API
        await axios.put(`${base_url}/savings/${req.params.id}`, req.body);
        // เมื่อแก้ไขเสร็จ ให้กลับไปที่หน้าประวัติของสมาชิกคนเดิม
        res.redirect("/savings/history/" + req.body.member_id);
    } catch (err) {
        //แสดงข้อความข้อผิดพลาดใน console เพื่อช่วยในการดีบัก
        console.error("Error updating saving record:", err.message);
        //ส่งสถานะ HTTP 500 พร้อมข้อความ "แก้ไขข้อมูลไม่สำเร็จ" กลับไปยัง client เพื่อแจ้งว่าเกิดข้อผิดพลาดในการอัปเดตข้อมูลรายการเงินฝาก
        res.status(500).send("แก้ไขข้อมูลไม่สำเร็จ");
    }
});
app.get("/edit-saving/:id", async (req, res) => {//กำหนดเส้นทางสำหรับหน้า "/edit-saving/:id" ของเว็บไซต์ โดยใช้ HTTP GET method เมื่อมีการเข้าถึงเส้นทางนี้จะทำงานในบล็อกนี้
    try {
        // ดึงข้อมูลรายการเงินฝากพร้อมชื่อสมาชิก
        const response = await axios.get(`${base_url}/savings/${req.params.id}`);
        // ดึงข้อมูลสมาชิกทั้งหมดเพื่อให้เลือกได้ในฟอร์ม และดึงข้อมูลเงินฝากทั้งหมดเพื่อคำนวณยอดรวมในหน้า EJS
        res.render("edit_saving", { saving: response.data });//เมื่อได้รับข้อมูลรายการเงินฝากจาก Backend แล้ว จะใช้ res.render() เพื่อเรนเดอร์หน้า EJS ชื่อ "edit_saving"
    } catch (err) {
        console.error("Error:", err.message);
        res.redirect("/savings"); // ถ้าหาไม่เจอจริงๆ ถึงจะกลับหน้าหลัก
    }
});

// 2. จัดการอัปเดต และ Redirect กลับไปหน้า History ของสมาชิกคนนั้น
app.post("/update-saving/:id", async (req, res) => {//กำหนดเส้นทางสำหรับการอัปเดตข้อมูลรายการเงินฝากที่ "/update-saving/:id" ของเว็บไซต์ 
// โดยใช้ HTTP POST method เมื่อมีการส่งข้อมูลจากฟอร์มในหน้า "edit_saving" จะทำงานในบล็อกนี้
    try {
        await axios.put(`${base_url}/savings/${req.params.id}`, req.body);//ใช้ axios เพื่อส่งคำขอ PUT ไปยัง API ที่อยู่ใน Backend 
        //                                                                  เพื่อทำการอัปเดตข้อมูลรายการเงินฝากที่มี saving_id ตามที่ระบุใน URL โดยส่งข้อมูลใหม่ที่ได้รับจากฟอร์มผ่าน req.body ไปยัง API
        // req.body.member_id ต้องส่งมาจากฟอร์ม (input hidden)
        res.redirect("/savings/history/" + req.body.member_id); //เมื่อการอัปเดตข้อมูลรายการเงินฝากสำเร็จแล้ว ให้ใช้ res.redirect() เพื่อเปลี่ยนเส้นทางกลับไปที่หน้า "/savings/history/:id" ของสมาชิกคนนั้น โดยใช้ member_id ที่ส่งมาจากฟอร์มเพื่อระบุสมาชิกที่ต้องการแสดงประวัติการฝากเงิน
    } catch (err) {
        res.status(500).send("Update Failed");//ส่งสถานะ HTTP 500 พร้อมข้อความ "Update Failed" กลับไปยัง client เพื่อแจ้งว่าเกิดข้อผิดพลาดในการอัปเดตข้อมูลรายการเงินฝาก
    }
});

// 3. จัดการลบ และ Redirect กลับไปหน้า History (ต้องส่ง id สมาชิกมาด้วย)
app.get("/delete-saving/:id", async (req, res) => {//กำหนดเส้นทางสำหรับการลบรายการเงินฝากที่ "/delete-saving/:id" 
// ของเว็บไซต์ โดยใช้ HTTP GET method เมื่อมีการเข้าถึงเส้นทางนี้จะทำงานในบล็อกนี้
    try {
        // ดึงข้อมูลก่อนลบเพื่อเอา member_id ไว้สำหรับ redirect กลับ
        const saving = await axios.get(`${base_url}/savings/${req.params.id}`);//ใช้ axios เพื่อส่งคำขอ GET ไปยัง API ที่อยู่ใน Backend 
        // เพื่อดึงข้อมูลรายการเงินฝากที่มี saving_id ตามที่ระบุใน URL ผ่านตัวแปร req.params.id
        const memberId = saving.data.member_id;// ดึงค่า member_id จากข้อมูลรายการเงินฝากที่ดึงมาได้ เพื่อใช้ในการ redirect กลับไปที่หน้าประวัติการฝากเงินของสมาชิกคนนั้น

        await axios.delete(`${base_url}/savings/${req.params.id}`);//ใช้ axios เพื่อส่งคำขอ DELETE ไปยัง API ที่อยู่ใน Backend 
        //                                                          เพื่อทำการลบรายการเงินฝากที่มี saving_id ตามที่ระบุใน URL
        res.redirect("/savings/history/" + memberId);//เมื่อการลบรายการเงินฝากสำเร็จแล้ว ให้ใช้ res.redirect() เพื่อเปลี่ยนเส้นทางกลับไปที่หน้า "/savings/history/:id" ของสมาชิกคนนั้น โดยใช้ member_id
        //                                              ที่ดึงมาจากข้อมูลรายการเงินฝากก่อนลบเพื่อระบุสมาชิกที่ต้องการแสดงประวัติการฝากเงิน
    } catch (err) {
        res.redirect("/savings");//เมื่อเกิดข้อผิดพลาดในการลบรายการเงินฝาก ให้ใช้ res.redirect() เพื่อเปลี่ยนเส้นทางกลับไปที่หน้า "/savings"
    }
});
app.get("/add-saving", async (req, res) => {//กำหนดเส้นทางสำหรับหน้า "/add-saving" ของเว็บไซต์ โดยใช้ HTTP GET method เมื่อมีการเข้าถึงเส้นทางนี้จะทำงานในบล็อกนี้
    try {
        const memberId = req.query.member_id;// ดึงค่า member_id จาก query parameter ใน URL เพื่อใช้ในการดึงข้อมูลสมาชิกที่ต้องการเพิ่มเงินฝากให้
        if (!memberId) return res.redirect("/savings");// หากไม่มี member_id ใน query parameter ให้เปลี่ยนเส้นทางกลับไปที่หน้า "/savings"
        const response = await axios.get(`${base_url}/members/${memberId}`);//ใช้ axios เพื่อส่งคำขอ GET ไปยัง API ที่อยู่ใน Backend เพื่อดึงข้อมูลสมาชิกที่มี member_id 
        //                                                                      ตามที่ระบุใน query parameter ผ่านตัวแปร req.query.member_id
        res.render("add-saving", { //เมื่อได้รับข้อมูลสมาชิกจาก Backend แล้ว จะใช้ res.render() เพื่อเรนเดอร์หน้า EJS ชื่อ "add-saving"
            member: response.data // ส่งข้อมูลสมาชิกที่ดึงมาได้ผ่านตัวแปร member ไปยังหน้า EJS เพื่อแสดงชื่อสมาชิกในฟอร์มเพิ่มเงินฝาก
        });
    } catch (err) {
        console.error(err);//แสดงข้อความข้อผิดพลาดใน console เพื่อช่วยในการดีบัก
        res.redirect("/savings");//เมื่อเกิดข้อผิดพลาดในการดึงข้อมูลสมาชิกสำหรับหน้าเพิ่มเงินฝาก ให้ใช้ res.redirect() เพื่อเปลี่ยนเส้นทางกลับไปที่หน้า "/savings"
    }
});
app.get("/reports", async (req, res) => {
    try {
        const membersRes = await axios.get(base_url + '/members');//ใช้ axios เพื่อส่งคำขอ GET ไปยัง API ที่อยู่ใน Backend เพื่อดึงข้อมูลสมาชิกทั้งหมด
        const loansRes = await axios.get(base_url + '/loans');//ใช้ axios เพื่อส่งคำขอ GET ไปยัง API ที่อยู่ใน Backend เพื่อดึงข้อมูลรายการเงินกู้ทั้งหมด
        const savingsRes = await axios.get(base_url + '/savings');//ใช้ axios เพื่อส่งคำขอ GET ไปยัง API ที่อยู่ใน Backend เพื่อดึงข้อมูลรายการเงินฝากทั้งหมด

        res.render("reports", { //เมื่อได้รับข้อมูลสมาชิก รายการเงินกู้ และรายการเงินฝากจาก Backend แล้ว จะใช้ res.render() เพื่อเรนเดอร์หน้า EJS ชื่อ "reports"
            members: membersRes.data, // ส่งข้อมูลสมาชิกที่ดึงมาได้ผ่านตัวแปร members ไปยังหน้า EJS
            loans: loansRes.data,// ส่งข้อมูลรายการเงินกู้ที่ดึงมาได้ผ่านตัวแปร loans ไปยังหน้า EJS
            savings: savingsRes.data// ส่งข้อมูลรายการเงินฝากที่ดึงมาได้ผ่านตัวแปร savings ไปยังหน้า EJS
        });
    } catch (err) {
        console.error("Error loading reports:", err.message);//แสดงข้อความข้อผิดพลาดใน console เพื่อช่วยในการดีบัก
        res.render("reports", { members: [], loans: [], savings: [] });//หากเกิดข้อผิดพลาดในการดึงข้อมูลสมาชิก รายการเงินกู้ หรือรายการเงินฝากจาก Backend 
        // จะทำงานในบล็อกนี้ โดยจะเรนเดอร์หน้า "reports" แต่ส่งข้อมูลเป็นอาร์เรย์ว่างแทน เพื่อให้หน้าแสดงว่าไม่มีข้อมูลในแต่ละส่วน
    }
});

app.listen(frontend_port, () => {
    console.log(`FrontEnd SafeFund Run http://localhost:${frontend_port}/`);//ใช้ app.listen() เพื่อเริ่มต้นเซิร์ฟเวอร์ที่พอร์ตที่กำหนดในตัวแปร frontend_port 
    // และเมื่อเซิร์ฟเวอร์เริ่มทำงานแล้ว จะพิมพ์ข้อความ "FrontEnd SafeFund Run http://localhost:frontend_port/" ลงใน console เพื่อแจ้งว่าเซิร์ฟเวอร์พร้อมใช้งานแล้ว
});
