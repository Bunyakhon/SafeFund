require("dotenv").config();//ใช้แพ็กเกจ dotenv ไว้ใน process.env
const express = require("express"); //สร้างตัวแปร express เพื่อเรียกใช้งาน Express.js
const Sequelize = require("sequelize"); //สร้างตัวแปร Sequelize เพื่อเรียกใช้งาน Sequelize ORM
const app = express(); //สร้างตัวแปร app เพื่อใช้งาน Express.js

app.use(express.json()); //ให้ Express.js สามารถแปลงข้อมูล JSON เป็น JavaScript Object ได้


const sequelize = new Sequelize("database", "username", "password", { //สร้างตัวแปร sequelize เพื่อเชื่อมต่อกับฐานข้อมูล โดยใช้ Sequelize ORM
  host: "localhost", //กำหนดโฮสต์ของฐานข้อมูล โดยใช้ "localhost"
  dialect: "sqlite", //กำหนดใช้ SQLite เป็นฐานข้อมูล
  storage: "./Database/DBSafeFund.sqlite", //กำหนดที่เก็บไฟล์ฐานข้อมูล SQLite ที่ชื่อ "DBSafeFund.sqlite" ในโฟลเดอร์ "Database"
});

const Member = sequelize.define("Member", { //กำหนดโมเดล Member โดยใช้ Sequelize ORM เก็บไว้ในตัวแปร Member
  member_id: { //กำหนดฟิลด์ member_id 
    type: Sequelize.INTEGER, //กำหนดชนิดข้อมูลเป็น INTEGER
    primaryKey: true, //กำหนดให้เป็น Primary Key
    autoIncrement: true, //กำหนดให้ค่า member_id เพิ่มขึ้นอัตโนมัติเมื่อมีการสร้างสมาชิกใหม่
  },
  member_name: { //กำหนดฟิลด์ member_name
    type: Sequelize.STRING, //กำหนดชนิดข้อมูลเป็น STRING
    allowNull: false, //กำหนดให้ ไม่ให้ค่า member_name เป็น null หรือค่าว่าง
  },
  address: { //กำหนดฟิลด์ address
    type: Sequelize.TEXT, //กำหนดชนิดข้อมูลเป็น TEXT
    allowNull: false, //กำหนดให้ ไม่ให้ค่า member_name เป็น null หรือค่าว่าง
  },
  phone: { //กำหนดฟิลด์ phone
    type: Sequelize.STRING, //กำหนดชนิดข้อมูลเป็น STRING
    allowNull: false, ////กำหนดให้ ไม่ให้ค่า member_name เป็น null หรือค่าว่าง
  },
});

const Loan = sequelize.define("loan", { //กำหนดโมเดล Loan โดยใช้ Sequelize ORM เก็บไว้ในตัวแปร Loan
  loan_id: { //กำหนดฟิลด์ loan_id
    type: Sequelize.INTEGER, //กำหนดชนิดข้อมูลเป็น INTEGER
    primaryKey: true, //กำหนดให้เป็น Primary Key
    autoIncrement: true, //กำหนดให้ค่า loan_id เพิ่มขึ้นอัตโนมัติเมื่อมีการสร้างสัญญาเงินกู้ใหม่
  },
  member_id: { //กำหนดฟิลด์ member_id
    type: Sequelize.INTEGER, //กำหนดชนิดข้อมูลเป็น INTEGER
    allowNull: false, //กำหนดให้ ไม่ให้ค่า member_id เป็น null หรือค่าว่าง เพราะต้องเชื่อมโยงกับสมาชิกที่มีอยู่ในตาราง Member
  },
  loan_amount: { //กำหนดฟิลด์ loan_amount
    type: Sequelize.DECIMAL(10, 2), //กำหนดชนิดข้อมูลเป็น DECIMAL โดยมีความยาวรวม 10 หลัก และมีทศนิยม 2 หลัก เพื่อเก็บจำนวนเงินกู้
    allowNull: false,//กำหนดให้ ไม่ให้ค่า loan_amount เป็น null หรือค่าว่าง เพราะต้องระบุจำนวนเงินกู้ที่ต้องการ
  },
  interest_rate: { //กำหนดฟิลด์ interest_rate
    type: Sequelize.DECIMAL(10, 2), //กำหนดชนิดข้อมูลเป็น DECIMAL โดยมีความยาวรวม 10 หลัก และมีทศนิยม 2 หลัก เพื่อเก็บอัตราดอกเบี้ย
    allowNull: false, //กำหนดให้ ไม่ให้ค่า interest_rate เป็น null หรือค่าว่าง เพราะต้องระบุอัตราดอกเบี้ยที่ใช้ในการคำนวณยอดชำระรายเดือน
  },
  duration_months: { //กำหนดฟิลด์ duration_months
    type: Sequelize.INTEGER, // กำหนดชนิดข้อมูลเป็น INTEGER เพื่อเก็บจำนวนเดือนที่ต้องการกู้
    defaultValue: 12, // กำหนดค่าเริ่มต้นเป็น 12 เดือน หากผู้ใช้ไม่ระบุจำนวนเดือนในการกู้
    allowNull: false, //กำหนดให้ ไม่ให้ค่า duration_months เป็น null หรือค่าว่าง เพราะต้องระบุจำนวนเดือนที่ต้องการกู้เพื่อคำนวณยอดชำระรายเดือน
  },
  status: { //กำหนดฟิลด์ status
    type: Sequelize.STRING, //กำหนดชนิดข้อมูลเป็น STRING เพื่อเก็บสถานะของสัญญาเงินกู้ เช่น "ปกติ", "ปิดยอดแล้ว", "ผิดนัดชำระ"
    allowNull: false, //กำหนดให้ ไม่ให้ค่า status เป็น null หรือค่าว่าง เพราะต้องระบุสถานะของสัญญาเงินกู้เพื่อการจัดการและแสดงผลที่ถูกต้อง
  },
});

const Payment = sequelize.define("payment", { //กำหนดโมเดล Payment โดยใช้ Sequelize ORM เก็บไว้ในตัวแปร Payment
  payment_id: { //กำหนดฟิลด์ payment_id
    type: Sequelize.INTEGER, //กำหนดชนิดข้อมูลเป็น INTEGER
    primaryKey: true, //กำหนดให้เป็น Primary Key
    autoIncrement: true,//กำหนดให้ค่า payment_id เพิ่มขึ้นอัตโนมัติเมื่อมีการสร้างงวดการชำระเงินใหม่
  },
  loan_id: {//กำหนดฟิลด์ loan_id
    type: Sequelize.INTEGER,//กำหนดชนิดข้อมูลเป็น INTEGER
    allowNull: false,//กำหนดให้ ไม่ให้ค่า loan_id เป็น null หรือค่าว่าง เพราะต้องเชื่อมโยงกับสัญญาเงินกู้ที่มีอยู่ในตาราง Loan
  },
  amount: {//กำหนดฟิลด์ amount
    type: Sequelize.DECIMAL(10, 2),//กำหนดชนิดข้อมูลเป็น DECIMAL โดยมีความยาวรวม 10 หลัก และมีทศนิยม 2 หลัก เพื่อเก็บจำนวนเงินที่ต้องชำระในแต่ละงวด
    allowNull: false,//กำหนดให้ ไม่ให้ค่า amount เป็น null หรือค่าว่าง เพราะต้องระบุจำนวนเงินที่ต้องชำระในแต่ละงวดเพื่อการจัดการและแสดงผลที่ถูกต้อง
  },
  payment_date: {// กำหนดฟิลด์ payment_date
    type: Sequelize.STRING,//กำหนดชนิดข้อมูลเป็น STRING เพื่อเก็บวันที่กำหนดชำระเงินในแต่ละงวด โดยใช้รูปแบบ "DD-MM-YYYY"
    allowNull: false,//กำหนดให้ ไม่ให้ค่า payment_date เป็น null หรือค่าว่าง เพราะต้องระบุวันที่กำหนดชำระเงินในแต่ละงวดเพื่อการจัดการและแสดงผลที่ถูกต้อง
  },
  period: { //กำหนดฟิลด์ period
    type: Sequelize.INTEGER,//กำหนดชนิดข้อมูลเป็น INTEGER เพื่อเก็บหมายเลขงวดการชำระเงิน เช่น งวดที่ 1, งวดที่ 2, เป็นต้น
    allowNull: true,//กำหนดให้ ค่า period สามารถเป็น null หรือค่าว่างได้เพราะบางกรณีอาจไม่ต้องระบุหมายเลขงวด เช่น การชำระเงินแบบไม่แบ่งงวด หรือการชำระเงินที่เกิดขึ้นหลังจากสัญญาปิดยอดแล้ว
  },
  status: { 
    type: Sequelize.STRING,//กำหนดชนิดข้อมูลเป็น STRING เพื่อเก็บสถานะของงวดการชำระเงิน เช่น "Pending" (รอชำระ), "Paid" (ชำระแล้ว), "Overdue" (เกินกำหนด)
    defaultValue: 'Pending',//กำหนดค่าเริ่มต้นเป็น "Pending" (รอชำระ) หากผู้ใช้ไม่ระบุสถานะของงวดการชำระเงิน
    allowNull: true,//กำหนดให้ ค่า status สามารถเป็น null หรือค่าว่างได้เพราะบางกรณีอาจไม่ต้องระบุสถานะของงวดการชำระเงิน เช่น การชำระเงินที่เกิดขึ้นหลังจากสัญญาปิดยอดแล้ว หรือการชำระเงินที่ยังไม่ได้รับการยืนยัน
  },
});

const Saving = sequelize.define("saving", {//กำหนดโมเดล Saving โดยใช้ Sequelize ORM เก็บไว้ในตัวแปร Saving
  saving_id: {//กำหนดฟิลด์ saving_id
    type: Sequelize.INTEGER,//กำหนดชนิดข้อมูลเป็น INTEGER
    primaryKey: true,//กำหนดให้เป็น Primary Key
    autoIncrement: true,//กำหนดให้ค่า saving_id เพิ่มขึ้นอัตโนมัติเมื่อมีการสร้างรายการเงินฝากใหม่
  },
  member_id: {//กำหนดฟิลด์ member_id
    type: Sequelize.INTEGER,//กำหนดชนิดข้อมูลเป็น INTEGER
    allowNull: false,//กำหนดให้ ไม่ให้ค่า member_id เป็น null หรือค่าว่าง เพราะต้องเชื่อมโยงกับสมาชิกที่มีอยู่ในตาราง Member เพื่อระบุว่าเงินฝากนี้เป็นของสมาชิกคนใด
  },
  deposit_amount: {//กำหนดฟิลด์ deposit_amount
    type: Sequelize.DECIMAL(10, 2),//กำหนดชนิดข้อมูลเป็น DECIMAL โดยมีความยาวรวม 10 หลัก และมีทศนิยม 2 หลัก เพื่อเก็บจำนวนเงินที่ฝากเข้ามาในแต่ละครั้ง
    allowNull: false,//กำหนดให้ ไม่ให้ค่า deposit_amount เป็น null หรือค่าว่าง เพราะต้องระบุจำนวนเงินที่ฝากเข้ามาในแต่ละครั้งเพื่อการจัดการและแสดงผลที่ถูกต้อง
  },
  deposit_date: {//กำหนดฟิลด์ deposit_date
    type: Sequelize.STRING,//กำหนดชนิดข้อมูลเป็น STRING เพื่อเก็บวันที่ทำการฝากเงิน โดยใช้รูปแบบ "DD-MM-YYYY"
    allowNull: false,//กำหนดให้ ไม่ให้ค่า deposit_date เป็น null หรือค่าว่าง เพราะต้องระบุวันที่ทำการฝากเงินเพื่อการจัดการและแสดงผลที่ถูกต้อง
  },
});

// กำหนดความสัมพันธ์แบบ One-to-Many: สมาชิกหนึ่งคนสามารถมีรายการเงินฝากได้หลายรายการ
Member.hasMany(Saving, { foreignKey: "member_id" });
// กำหนดให้รายการเงินฝากแต่ละรายการ ต้องเป็นของสมาชิกคนใดคนหนึ่ง
Saving.belongsTo(Member, { foreignKey: "member_id" });

// กำหนดความสัมพันธ์แบบ One-to-Many: สมาชิกหนึ่งคนสามารถทำสัญญาเงินกู้ได้หลายสัญญา
Member.hasMany(Loan, { foreignKey: "member_id" });
// กำหนดให้สัญญาเงินกู้แต่ละฉบับ ต้องระบุเจ้าของสัญญาเป็นสมาชิกคนใดคนหนึ่ง
Loan.belongsTo(Member, { foreignKey: "member_id" });

// กำหนดความสัมพันธ์แบบ One-to-Many: สัญญาเงินกู้หนึ่งฉบับ สามารถมีงวดการชำระเงินได้หลายงวด
Loan.hasMany(Payment, { foreignKey: "loan_id" });
// กำหนดให้รายการชำระเงินแต่ละงวด ต้องอ้างอิงกลับไปยังสัญญาเงินกู้ที่เกี่ยวข้อง
Payment.belongsTo(Loan, { foreignKey: "loan_id" });


sequelize//สั่งให้ Sequelize ตรวจสอบและสร้างตารางในฐานข้อมูลให้ตรงกับโมเดลที่นิยามไว้
  .sync({ alter: false }) //  { alter: false } หมายถึงไม่ให้แก้ไขโครงสร้างตารางเดิมที่มีอยู่แล้ว หากต้องการให้เปลี่ยนตามโมเดลใหม่ตลอดต้องใช้ true
  .then(() => { //เชื่อมต่อและสร้างตารางสำเร็จทำงานในบล็อกนี้
    const port = process.env.PORT || 3000; //สร้างตัวแปร port มาเก็บค่าพอร์ตที่กำหนดในไฟล์ .env หรือใช้พอร์ต 3000 เป็นค่าเริ่มต้นหากไม่มีการกำหนดใน .env
    console.log("Create Database SafeFund Success");//เพื่อแสดงข้อความในคอนโซลว่า การสร้างฐานข้อมูลสำเร็จแล้ว
    app.listen(port, () => //สั่งให้ Express เริ่มทำงานและฟังคำขอที่เข้ามาที่พอร์ตที่กำหนดไว้ในตัวแปร port
      console.log(`BackEnd SafeFund Run http://localhost:${port}`),
    );
  })
  .catch((err) => console.log("Can not Run Because : " + err));//หากเกิดข้อผิดพลาดในขั้นตอนการ Sync แสดงข้อความแสดงข้อผิดพลาดในคอนโซล

// API CRUD สำหรับ Members
app.get("/members", (req, res) => { // app.get คือกำหนดเส้นทางดึงข้อมูลสมาชิกจาก url "localhost/หมายเลขport/members" เมื่อมีการเรียกใช้งานเส้นทางนี้จะทำงานในบล็อกนี้
  Member.findAll()// ใช้คำสั่ง findAll() เพื่อดึงข้อมูลทั้งหมดจากตาราง Member
    .then((member) => res.json(member))// เมื่อดึงข้อมูลสำเร็จจะส่งข้อมูลสมาชิกทั้งหมดกลับไปในรูปแบบ JSON
    .catch((err) => res.status(500).send(err));//เมื่อ error เกิดขึ้นจะส่งสถานะ 500 พร้อมข้อความ error 
});

app.get("/members/:id", (req, res) => {// app.get คือกำหนดเส้นทางดึงข้อมูลสมาชิกจาก url "localhost/หมายเลขport/members/:id" โดย :id 
                                        // เป็นตัวแปรที่ใช้แทนค่า member_id ที่ต้องการดึงข้อมูล เมื่อมีการเรียกใช้งานเส้นทางนี้จะทำงานในบล็อกนี้
  Member.findByPk(req.params.id)// ใช้คำสั่ง findByPk() เพื่อดึงข้อมูลสมาชิกตาม primary key (member_id) ที่ระบุใน URL ผ่านตัวแปร req.params.id
    .then((member) => {// เมื่อดึงข้อมูล member สำเร็จจะทำงานในบล็อกนี้
      if (!member) res.status(404).send("Member Not Found");//หากไม่เจอข้อมูลสมาชิกที่ตรงกับ member_id ที่ระบุใน URL จะส่งสถานะ 404 พร้อมข้อความ "Member Not Found"
      else res.json(member);//หากเจอข้อมูลสมาชิกที่ตรงกับ member_id ที่ระบุใน URL จะส่งข้อมูลสมาชิกนั้นกลับไปในรูปแบบ JSON
    })
    .catch((err) => res.status(500).send(err));//เมื่อ error เกิดขึ้นจะส่งสถานะ 500 พร้อมข้อความ error
});

app.post("/members", (req, res) => { // app.post คือกำหนดเส้นทางสำหรับสร้างสมาชิกใหม่จาก url "localhost/หมายเลขport/members" 
                                    // เมื่อมีการเรียกใช้งานเส้นทางนี้จะทำงานในบล็อกนี้
  Member.create(req.body)// ใช้คำสั่ง create() เพื่อสร้างข้อมูลสมาชิกใหม่ในตาราง Member โดยข้อมูลที่ใช้ในการสร้างจะมาจาก req.body 
                          // ซึ่งเป็นข้อมูลที่ส่งมาจาก client ในรูปแบบ JSON
    .then((member) => res.send(member))// เมื่อสร้างสมาชิกใหม่สำเร็จจะส่งข้อมูลสมาชิกที่ถูกสร้างกลับไปในรูปแบบ JSON
    .catch((err) => res.status(500).send(err));//เมื่อ error เกิดขึ้นจะส่งสถานะ 500 พร้อมข้อความ error
});

app.put("/members/:id", (req, res) => {// app.put คือกำหนดเส้นทางสำหรับอัปเดตข้อมูลสมาชิกจาก url "localhost/หมายเลขport/members/:id"  
                                      // โดย :id เป็นตัวแปรที่ใช้แทนค่า member_id ที่ต้องการอัปเดตข้อมูล เมื่อมีการเรียกใช้งานเส้นทางนี้จะทำงานในบล็อกนี้
  Member.findByPk(req.params.id)// ใช้คำสั่ง findByPk() เพื่อค้นหาข้อมูลสมาชิกตาม primary key (member_id) ที่ระบุใน URL ผ่านตัวแปร req.params.id
    .then((member) => {// เมื่อค้นหาข้อมูล member สำเร็จจะทำงานในบล็อกนี้
      if (!member) res.status(404).send("Member Not Found");//หากไม่เจอข้อมูลสมาชิกที่ตรงกับ member_id ที่ระบุใน URL จะส่งสถานะ 404 พร้อมข้อความ "Member Not Found"
      else { //หากเจอข้อมูลสมาชิกที่ตรงกับ member_id ที่ระบุใน URL จะทำงานในบล็อกนี้
        member.update(req.body)// ใช้คำสั่ง update() เพื่ออัปเดตข้อมูลสมาชิกที่ค้นพบ โดยข้อมูลที่ใช้ในการอัปเดตจะมาจาก req.body 
        // ซึ่งเป็นข้อมูลที่ส่งมาจาก client ในรูปแบบ JSON
          .then(() => res.send(member))// เมื่ออัปเดตข้อมูลสมาชิกสำเร็จจะส่งข้อมูลสมาชิกที่ถูกอัปเดตกลับไปในรูปแบบ JSON
          .catch((err) => res.status(500).send(err));//เมื่อ error เกิดขึ้นจะส่งสถานะ 500 พร้อมข้อความ error
      }
    })
    .catch((err) => res.status(500).send(err));//เมื่อ error เกิดขึ้นในขั้นตอนการค้นหาข้อมูลสมาชิกจะส่งสถานะ 500 พร้อมข้อความ error
});

app.delete("/members/:id", (req, res) => {// app.delete คือกำหนดเส้นทางสำหรับลบข้อมูลสมาชิกจาก url "localhost/หมายเลขport/members/:id"
  Member.findByPk(req.params.id)// ใช้คำสั่ง findByPk() เพื่อค้นหาข้อมูลสมาชิกตาม primary key (member_id) ที่ระบุใน URL ผ่านตัวแปร req.params.id
    .then((member) => {// เมื่อค้นหาข้อมูล member สำเร็จจะทำงานในบล็อกนี้
      if (!member) res.status(404).send("Member Not Found");//หากไม่เจอข้อมูลสมาชิกที่ตรงกับ member_id ที่ระบุใน URL จะส่งสถานะ 404 พร้อมข้อความ "Member Not Found"
      else {//หากเจอข้อมูลสมาชิกที่ตรงกับ member_id ที่ระบุใน URL จะทำงานในบล็อกนี้
        member.destroy()// ใช้คำสั่ง destroy() เพื่อทำการลบข้อมูลสมาชิกที่ค้นพบ
          .then(() => res.send("Member Deleted"))// เมื่อการลบข้อมูลสมาชิกสำเร็จจะส่งข้อความ "Member Deleted" กลับไป
          .catch((err) => res.status(500).send(err));//เมื่อ error เกิดขึ้นในขั้นตอนการลบข้อมูลสมาชิกจะส่งสถานะ 500 พร้อมข้อความ error
      }
    })
    .catch((err) => res.status(500).send(err));//เมื่อ error เกิดขึ้นในขั้นตอนการค้นหาข้อมูลสมาชิกจะส่งสถานะ 500 พร้อมข้อความ error
});


// --- API Routes สำหรับ Loans ---
// API CRUD สำหรับ Loans
app.get("/loans", (req, res) => {// app.get คือกำหนดเส้นทางดึงข้อมูลสัญญาเงินกู้จาก url "localhost/หมายเลขport/loans" เมื่อมีการเรียกใช้งานเส้นทางนี้จะทำงานในบล็อกนี้
  Loan.findAll({ // ใช้คำสั่ง findAll() เพื่อดึงข้อมูลทั้งหมดจากตาราง Loan
    include: [Member, Payment] // ใช้คำสั่ง include เพื่อดึงข้อมูลที่เกี่ยวข้องจากตาราง Member และ Payment มาแสดงร่วมกับข้อมูลสัญญาเงินกู้ โดยจะเชื่อมโยงข้อมูลตามความสัมพันธ์ที่กำหนดไว้ในโมเดล
  })
    .then((loans) => res.json(loans))// เมื่อดึงข้อมูลสำเร็จจะส่งข้อมูลสัญญาเงินกู้ทั้งหมดกลับไปในรูปแบบ JSON พร้อมข้อมูลสมาชิกและงวดการชำระเงินที่เกี่ยวข้อง
    .catch((err) => res.status(500).send(err));//เมื่อ error เกิดขึ้นจะส่งสถานะ 500 พร้อมข้อความ error
});

app.get("/loans/:id", (req, res) => {// app.get คือกำหนดเส้นทางดึงข้อมูลสัญญาเงินกู้จาก url "localhost/หมายเลขport/loans/:id" โดย :id เป็นตัวแปรที่ใช้แทนค่า loan_id ที่ต้องการดึงข้อมูล เมื่อมีการเรียกใช้งานเส้นทางนี้จะทำงานในบล็อกนี้
  Loan.findByPk(req.params.id, { // ใช้คำสั่ง findByPk() เพื่อดึงข้อมูลสัญญาเงินกู้ตาม primary key (loan_id) ที่ระบุใน URL ผ่านตัวแปร req.params.id
    include: [ // ใช้คำสั่ง include เพื่อดึงข้อมูลที่เกี่ยวข้องจากตาราง Member และ Payment มาแสดงร่วมกับข้อมูลสัญญาเงินกู้ โดยจะเชื่อมโยงข้อมูลตามความสัมพันธ์ที่กำหนดไว้ในโมเดล
      { model: Member }, // ดึงข้อมูลสมาชิกที่เกี่ยวข้องกับสัญญาเงินกู้
      { model: Payment } // ดึงข้อมูลงวดการชำระเงินที่เกี่ยวข้องกับสัญญาเงินกู้
    ]
  })
    .then((loan) => { // เมื่อดึงข้อมูลสำเร็จจะทำงานในบล็อกนี้
      if (!loan) res.status(404).send("Loan Contract Not Found"); //หากไม่เจอข้อมูลสัญญาเงินกู้ที่ตรงกับ loan_id ที่ระบุใน URL จะส่งสถานะ 404 พร้อมข้อความ "Loan Contract Not Found"
      else {//หากเจอข้อมูลสัญญาเงินกู้ที่ตรงกับ loan_id ที่ระบุใน URL จะทำงานในบล็อกนี้
        if (loan.payments) { //ตรวจสอบว่ามีข้อมูลงวดการชำระเงินที่เกี่ยวข้องกับสัญญาเงินกู้หรือไม่ หากมีข้อมูลงวดการชำระเงิน 
            loan.payments.sort((a, b) => a.period - b.period);//จะทำการเรียงลำดับงวดการชำระเงินตามหมายเลขงวด (period) จากน้อยไปมาก เพื่อให้แสดงผลในลำดับที่ถูกต้อง
        }
        res.json(loan); //ส่งข้อมูลสัญญาเงินกู้ที่ดึงมาได้กลับไปในรูปแบบ JSON พร้อมข้อมูลสมาชิกและงวดการชำระเงินที่เกี่ยวข้อง
      }
    })
    .catch((err) => {//เมื่อ error เกิดขึ้นจะทำงานในบล็อกนี้
      console.error(err); // แสดงข้อความ error ในคอนโซลเพื่อช่วยในการวิเคราะห์ปัญหา
      res.status(500).send(err.message);//ส่งสถานะ 500 พร้อมข้อความ error กลับไปยัง client เพื่อแจ้งว่าเกิดข้อผิดพลาดในการดึงข้อมูลสัญญาเงินกู้
    });
});

app.post("/loans", async (req, res) => { // app.post คือกำหนดเส้นทางสำหรับสร้างสัญญาเงินกู้ใหม่จาก url "localhost/หมายเลขport/loans" เมื่อมีการเรียกใช้งานเส้นทางนี้จะทำงานในบล็อกนี้
  try { //ใช้ try-catch เพื่อจัดการกับข้อผิดพลาดที่อาจเกิดขึ้นในขั้นตอนการสร้างสัญญาเงินกู้และคำนวณงวดการชำระเงิน
    const loan = await Loan.create(req.body); // ใช้คำสั่ง create() เพื่อสร้างข้อมูลสัญญาเงินกู้ใหม่ในตาราง Loan 
                                              // โดยข้อมูลที่ใช้ในการสร้างจะมาจาก req.body ซึ่งเป็นข้อมูลที่ส่งมาจาก client ในรูปแบบ JSON
    const principal = parseFloat(loan.loan_amount); //สร้างตัวแปร principal เก็บค่าที่แปลงค่า loan_amount ที่เป็น string 
                                                    // ให้เป็นตัวเลขทศนิยมเพื่อใช้ในการคำนวณยอดชำระรายเดือน
    const interestRate = parseFloat(loan.interest_rate) / 100; //สร้างตัวแปร interestRate เก็บค่าที่แปลงค่า  interest_rate ที่เป็น string 
    //                                                        ให้เป็นตัวเลขทศนิยม และหารด้วย 100 เพื่อแปลงจากเปอร์เซ็นต์เป็นอัตราส่วนสำหรับการคำนวณดอกเบี้ย
    const months = parseInt(loan.duration_months); //สร้างตัวแปร months เก็บค่าที่แปลงค่า duration_months ที่เป็น string 
    //                                              ให้เป็นตัวเลขจำนวนเต็มเพื่อใช้ในการคำนวณยอดชำระรายเดือน
    const totalInterest = principal * interestRate;//สร้างตัวแปร totalInterest เก็บค่าที่คำนวณจากการนำจำนวนเงินกู้ (principal) คูณกับอัตราดอกเบี้ย (interestRate) เพื่อหายอดดอกเบี้ยทั้งหมดที่ต้องชำระตลอดระยะเวลาของสัญญาเงินกู้
    const totalAmount = principal + totalInterest;//สร้างตัวแปร totalAmount เก็บค่าที่คำนวณจากการนำจำนวนเงินกู้ (principal) บวกกับยอดดอกเบี้ยทั้งหมด (totalInterest) เพื่อหายอดรวมที่ต้องชำระตลอดระยะเวลาของสัญญาเงินกู้
    const monthlyPayment = (totalAmount / months).toFixed(2);//สร้างตัวแปร monthlyPayment เก็บค่าที่คำนวณจากการนำยอดรวมที่ต้องชำระตลอดระยะเวลาของสัญญาเงินกู้ (totalAmount)
    //                                                         หารด้วยจำนวนเดือน (months) เพื่อหายอดชำระรายเดือน และใช้ toFixed(2) เพื่อปัดเศษให้มีทศนิยม 2 หลัก
    const payments = []; //สร้างตัวแปร payments เป็นอาร์เรย์ว่างเพื่อเก็บข้อมูลงวดการชำระเงินที่จะถูกสร้างขึ้นในขั้นตอนถัดไป
    const startDate = new Date(); //สร้างตัวแปร startDate เก็บค่าวันที่ปัจจุบันในรูปแบบของออบเจ็กต์ Date เพื่อใช้เป็นวันที่เริ่มต้นในการคำนวณวันที่กำหนดชำระเงินในแต่ละงวด

    for (let i = 1; i <= months; i++) { //ใช้ลูป for เพื่อทำการสร้างข้อมูลงวดการชำระเงินตามจำนวนเดือนที่ระบุในสัญญาเงินกู้ โดยเริ่มต้นจากงวดที่ 1 จนถึงงวดที่เท่ากับจำนวนเดือน (months)
      const dueDate = new Date(startDate); //สร้างตัวแปร dueDate เก็บค่าวันที่กำหนดชำระเงินในแต่ละงวด โดยเริ่มต้นจากวันที่ปัจจุบัน (startDate) 
      //                                      และจะถูกปรับเปลี่ยนในแต่ละรอบของลูปเพื่อให้ได้วันที่กำหนดชำระเงินที่ถูกต้องสำหรับแต่ละงวด
      dueDate.setMonth(startDate.getMonth() + i);//ใช้คำสั่ง setMonth() เพื่อปรับเปลี่ยนเดือนของ dueDate โดยการนำเดือนของ startDate มาบวกกับหมายเลขงวด (i) 
      //                                        เพื่อให้ได้วันที่กำหนดชำระเงินที่ถูกต้องสำหรับแต่ละงวด เช่น งวดที่ 1 จะเป็นเดือนถัดไปจาก startDate,
      //                                          งวดที่ 2 จะเป็นสองเดือนถัดไปจาก startDate เป็นต้น

      payments.push({ //ใช้คำสั่ง push() เพื่อเพิ่มข้อมูลงวดการชำระเงินใหม่ลงในอาร์เรย์ payments โดยข้อมูลที่เพิ่มจะเป็นออบเจ็กต์ที่มีฟิลด์ 
      //                  loan_id, amount, period, payment_date และ status
        loan_id: loan.loan_id,//กำหนดค่า loan_id เป็นค่า loan_id ของสัญญาเงินกู้ที่เพิ่งถูกสร้างขึ้น เพื่อเชื่อมโยงงวดการชำระเงินนี้กับสัญญาเงินกู้ที่เกี่ยวข้อง
        amount: monthlyPayment,//กำหนดค่า amount เป็นยอดชำระรายเดือนที่คำนวณได้จากตัวแปร monthlyPayment เพื่อระบุจำนวนเงินที่ต้องชำระในงวดนี้
        period: i,//กำหนดค่า period เป็นหมายเลขงวดที่กำลังถูกสร้างขึ้นในลูปนี้ เพื่อระบุว่างวดนี้เป็นงวดที่เท่าไหร่ เช่น งวดที่ 1, งวดที่ 2, เป็นต้น
        payment_date: dueDate.toISOString().split('T')[0], //กำหนดค่า payment_date เป็นวันที่กำหนดชำระเงินในรูปแบบ "YYYY-MM-DD" โดยใช้คำสั่ง toISOString() เพื่อแปลง dueDate เป็นรูปแบบ ISO string และใช้ split('T')[0] เพื่อแยกเอาเฉพาะส่วนวันที่ออกมา
        status: 'Pending' //กำหนดค่า status เป็น "Pending" เพื่อระบุว่างวดการชำระเงินนี้ยังไม่ได้รับการชำระเงินและอยู่ในสถานะรอชำระ
      });
    }

    await Payment.bulkCreate(payments); //ใช้คำสั่ง bulkCreate() เพื่อสร้างข้อมูลงวดการชำระเงินทั้งหมดที่เก็บอยู่ในอาร์เรย์ payments 
    //                            ลงในตาราง Payment ในฐานข้อมูล โดยจะทำการสร้างเรคคอร์ดใหม่สำหรับแต่ละออบเจ็กต์ในอาร์เรย์ payments

    res.status(201).send(loan);//ส่งสถานะ 201 พร้อมข้อมูลสัญญาเงินกู้ที่ถูกสร้างใหม่กลับไปในรูปแบบ JSON เพื่อแจ้งว่า การสร้างสัญญาเงินกู้และงวดการชำระเงินสำเร็จแล้ว
  } catch (err) {//เมื่อเกิดข้อผิดพลาดในขั้นตอนการสร้างสัญญาเงินกู้หรือคำนวณงวดการชำระเงินจะทำงานในบล็อกนี้
    console.error(err);//แสดงข้อความ error ในคอนโซลเพื่อช่วยในการวิเคราะห์ปัญหา
    res.status(500).send(err.message);//ส่งสถานะ 500 พร้อมข้อความ error กลับไปยัง client เพื่อแจ้งว่าเกิดข้อผิดพลาดในการสร้างสัญญาเงินกู้หรือคำนวณงวดการชำระเงิน
  }
});

app.put("/loans/:id", async (req, res) => {// app.put คือกำหนดเส้นทางสำหรับอัปเดตข้อมูลสัญญาเงินกู้จาก url "localhost/หมายเลขport/loans/:id" 
//                                          โดย :id เป็นตัวแปรที่ใช้แทนค่า loan_id ที่ต้องการอัปเดตข้อมูล เมื่อมีการเรียกใช้งานเส้นทางนี้จะทำงานในบล็อกนี้
  try {//ใช้ try-catch เพื่อจัดการกับข้อผิดพลาดที่อาจเกิดขึ้นในขั้นตอนการอัปเดตสัญญาเงินกู้และคำนวณงวดการชำระเงินใหม่
    const loan = await Loan.findByPk(req.params.id);// ใช้คำสั่ง findByPk() เพื่อค้นหาข้อมูลสัญญาเงินกู้ตาม primary key (loan_id) ที่ระบุใน URL 
    //                                                  ผ่านตัวแปร req.params.id
    if (!loan) return res.status(404).send("ไม่พบสัญญาเงินกู้");//หากไม่เจอข้อมูลสัญญาเงินกู้ที่ตรงกับ loan_id ที่ระบุใน URL 
    //                                                        จะส่งสถานะ 404 พร้อมข้อความ "ไม่พบสัญญาเงินกู้"
    const paidPayments = await Payment.count({ //สร้างตัวแปร paidPayments เก็บค่าที่นับจำนวนงวดการชำระเงินที่มีสถานะเป็น 
    //                                            "Paid" และเชื่อมโยงกับสัญญาเงินกู้ที่กำลังจะถูกอัปเดต
      where: { //ใช้คำสั่ง where เพื่อกำหนดเงื่อนไขในการนับจำนวนงวดการชำระเงิน โดยจะนับเฉพาะงวดที่มี loan_id ตรงกับ loan_id 
      //         ของสัญญาเงินกู้ที่กำลังจะถูกอัปเดต และมีสถานะเป็น "Paid"
        loan_id: loan.loan_id, //กำหนดเงื่อนไขให้ loan_id ของงวดการชำระเงินต้องตรงกับ loan_id ของสัญญาเงินกู้ที่กำลังจะถูกอัปเดต
        status: 'Paid' //กำหนดเงื่อนไขให้ status ของงวดการชำระเงินต้องเป็น "Paid" เพื่อให้นับเฉพาะงวดที่ได้รับการชำระเงินแล้ว
      } 
    });

    if (paidPayments > 0) { //ตรวจสอบว่ามีงวดการชำระเงินที่มีสถานะเป็น "Paid" หรือไม่ 
    // หากมีงวดที่ได้รับการชำระเงินแล้วจะไม่อนุญาตให้อัปเดตสัญญาเงินกู้และส่งข้อความแจ้งเตือนกลับไป
      return res.status(400).send("ไม่สามารถแก้ไขรายละเอียดการเงินได้ เนื่องจากมีการชำระเงินเข้ามาแล้วบางงวด");//ส่งสถานะ 400 พร้อมข้อความแจ้งเตือนว่า
      //                                                                          ไม่สามารถแก้ไขรายละเอียดการเงินได้ เนื่องจากมีการชำระเงินเข้ามาแล้วบางงวด
    }
    await loan.update(req.body);// ใช้คำสั่ง update() เพื่ออัปเดตข้อมูลสัญญาเงินกู้ที่ค้นพบ โดยข้อมูลที่ใช้ในการอัปเดตจะมาจาก req.body
    await Payment.destroy({ where: { loan_id: loan.loan_id } });//ใช้คำสั่ง destroy() เพื่อทำการลบข้อมูลงวดการชำระเงินทั้งหมด
    //                                                ที่เชื่อมโยงกับสัญญาเงินกู้ที่ถูกอัปเดตออกจากตาราง Payment ในฐานข้อมูล
    const principal = parseFloat(loan.loan_amount); //สร้างตัวแปร principal เก็บค่าที่แปลงค่า loan_amount ที่เป็น string 
    //                                                ให้เป็นตัวเลขทศนิยมเพื่อใช้ในการคำนวณยอดชำระรายเดือน
    const interestRate = parseFloat(loan.interest_rate) / 100;//สร้างตัวแปร interestRate เก็บค่าที่แปลงค่า  interest_rate ที่เป็น string
    const months = parseInt(loan.duration_months);//สร้างตัวแปร months เก็บค่าที่แปลงค่า duration_months ที่เป็น string 
                                                    // ให้เป็นตัวเลขจำนวนเต็มเพื่อใช้ในการคำนวณยอดชำระรายเดือน
    
    const totalInterest = principal * interestRate;//สร้างตัวแปร totalInterest เก็บค่าที่คำนวณจากการนำจำนวนเงินกู้ (principal) 
    //                                            คูณกับอัตราดอกเบี้ย (interestRate) เพื่อหายอดดอกเบี้ยทั้งหมดที่ต้องชำระตลอดระยะเวลาของสัญญาเงินกู้
    const totalAmount = principal + totalInterest;//สร้างตัวแปร totalAmount เก็บค่าที่คำนวณจากการนำจำนวนเงินกู้ (principal)
    //                                              บวกกับยอดดอกเบี้ยทั้งหมด (totalInterest)
    const monthlyPayment = (totalAmount / months).toFixed(2);//สร้างตัวแปร monthlyPayment เก็บค่าที่คำนวณจากการนำยอดรวมที่ต้องชำระตลอดระยะเวลาของสัญญาเงินกู้ (totalAmount)

    const payments = []; //สร้างตัวแปร payments เป็นอาร์เรย์ว่างเพื่อเก็บข้อมูลงวดการชำระเงินที่จะถูกสร้างขึ้นใหม่หลังจากที่สัญญาเงินกู้ถูกอัปเดต
    const startDate = new Date(loan.createdAt);//สร้าง startDate เก็บค่าวันที่สร้างสัญญาเงินกู้เดิมจากฟิลด์ createdAt ของสัญญาเงินกู้ที่ถูกอัปเดต 
    //                                           เพื่อใช้เป็นวันที่เริ่มต้นในการคำนวณวันที่กำหนดชำระเงินในแต่ละงวดใหม่หลังจากที่สัญญาเงินกู้ถูกอัปเดต

    const paymentStatus = loan.status === 'ปิดยอดแล้ว' ? 'Paid' : 'Pending'; //สร้างตัวแปร paymentStatus เก็บค่าสถานะของงวดการชำระเงินใหม่ที่ถูกสร้างขึ้นหลังจากที่สัญญาเงินกู้ถูกอัปเดต 
    //                                                                        โดยจะตรวจสอบว่าสถานะของสัญญาเงินกู้เป็น "ปิดยอดแล้ว" หรือไม่

    for (let i = 1; i <= months; i++) {//ใช้ลูป for เพื่อทำการสร้างข้อมูลงวดการชำระเงินใหม่ตามจำนวนเดือนที่ระบุในสัญญาเงินกู้ที่ถูกอัปเดต 
    //                                  โดยเริ่มต้นจากงวดที่ 1 จนถึงงวดที่เท่ากับจำนวนเดือน (months)
      const dueDate = new Date(startDate);//สร้างตัวแปร dueDate เก็บค่าวันที่กำหนดชำระเงินในแต่ละงวดใหม่ โดยเริ่มต้นจากวันที่สร้างสัญญาเงินกู้เดิม (startDate)
      dueDate.setMonth(startDate.getMonth() + i);//ใช้คำสั่ง setMonth() เพื่อปรับเปลี่ยนเดือนของ dueDate โดยการนำเดือนของ startDate มาบวกกับหมายเลขงวด (i)

      payments.push({//ใช้คำสั่ง push() เพื่อเพิ่มข้อมูลงวดการชำระเงินใหม่ลงในอาร์เรย์ payments โดยข้อมูลที่เพิ่มจะเป็นออบเจ็กต์ที่มีฟิลด์
        loan_id: loan.loan_id,//เก็บ ID ของสัญญาเงินกู้ที่งวดชำระนี้สังกัดอยู่
        amount: monthlyPayment,//เก็บจำนวนเงินที่ต้องชำระในงวดนี้ (ที่คำนวณไว้แล้ว)
        period: i,//เก็บเลขลำดับงวด (งวดที่ 1, 2, 3...)
        payment_date: dueDate.toISOString().split('T')[0],//เก็บวันที่ต้องชำระในรูปแบบ YYYY-MM-DD
        status: paymentStatus//เก็บสถานะการชำระเงิน (เช่น 'Pending' หรือ 'Paid')
      });
    }
    // ใช้ bulkCreate เพื่อบันทึกข้อมูลทุกงวดการชำระเงินที่มีในอาร์เรย์ payments ลงฐานข้อมูลพร้อมกันในครั้งเดียว
    await Payment.bulkCreate(payments);

    res.send({ // ส่ง Response กลับไปหา Client เมื่อดำเนินการทุกอย่างเสร็จสิ้น
      message: "อัปเดตสัญญาและคำนวณงวดชำระใหม่เรียบร้อยแล้ว",// ข้อความยืนยันการทำงานสำเร็จ
      loan: loan // ข้อมูลสัญญาเงินกู้ที่ถูกอัปเดต
    });

  } catch (err) { // บล็อกสำหรับจัดการเมื่อเกิดข้อผิดพลาดในการทำงาน (Exception Handling)
    console.error("เกิดข้อผิดพลาดในการอัปเดตสัญญา:", err);// แสดงรายละเอียดข้อผิดพลาดใน Console ของ Backend
    res.status(500).send(err.message);// ส่งสถานะ 500 และข้อความแจ้งความผิดพลาดกลับไปหาผู้ใช้งาน
  }
});
app.delete("/loans/:id", (req, res) => { //กำหนดเส้นทางสำหรับลบข้อมูลสัญญาเงินกู้จาก url "localhost/หมายเลขport/loans/:id" โดย :id 
//                                        เป็นตัวแปรที่ใช้แทนค่า loan_id ที่ต้องการลบข้อมูล เมื่อมีการเรียกใช้งานเส้นทางนี้จะทำงานในบล็อกนี้
  Loan.findByPk(req.params.id) // ใช้คำสั่ง findByPk() เพื่อค้นหาข้อมูลสัญญาเงินกู้ตาม primary key (loan_id) ที่ระบุใน URL ผ่านตัวแปร req.params.id
    .then((loan) => {
      if (!loan) res.status(404).send("Loan Contract Not Found");//หากไม่เจอข้อมูลสัญญาเงินกู้ที่ตรงกับ loan_id ที่ระบุใน URL จะส่งสถานะ 404 พร้อมข้อความ "Loan Contract Not Found"
      else {
        loan.destroy() // ใช้คำสั่ง destroy() เพื่อทำการลบข้อมูลสัญญาเงินกู้ที่ค้นพบ
          .then(() => res.send("Loan Contract Deleted"))// เมื่อการลบข้อมูลสัญญาเงินกู้สำเร็จจะส่งข้อความ "Loan Contract Deleted" กลับไป
          .catch((err) => res.status(500).send(err));//เมื่อ error เกิดขึ้นในขั้นตอนการลบข้อมูลสัญญาเงินกู้จะส่งสถานะ 500 พร้อมข้อความ error
      }
    })
    .catch((err) => res.status(500).send(err));//เมื่อ error เกิดขึ้นในขั้นตอนการค้นหาข้อมูลสัญญาเงินกู้จะส่งสถานะ 500 พร้อมข้อความ error
});

// API payment สำหรับยืนยันการชำระเงินในแต่ละงวด
app.put("/payments/:id/confirm", async (req, res) => { //กำหนดเส้นทางสำหรับยืนยันการชำระเงินในแต่ละงวดจาก url "localhost/หมายเลขport/payments/:id/confirm" โดย :id 
//                                                      เป็นตัวแปรที่ใช้แทนค่า payment_id ที่ต้องการยืนยันการชำระเงิน เมื่อมีการเรียกใช้งานเส้นทางนี้จะทำงานในบล็อกนี้
    try {//ใช้ try-catch เพื่อจัดการกับข้อผิดพลาดที่อาจเกิดขึ้นในขั้นตอนการยืนยันการชำระเงิน
        const payment = await Payment.findByPk(req.params.id);// ใช้คำสั่ง findByPk() เพื่อค้นหาข้อมูลการชำระเงินตาม primary key (payment_id) ที่ระบุใน URL ผ่านตัวแปร req.params.id
        if (!payment) return res.status(404).send("ไม่พบข้อมูลการชำระเงิน");//หากไม่เจอข้อมูลการชำระเงินที่ตรงกับ payment_id ที่ระบุใน URL จะส่งสถานะ 404 พร้อมข้อความ "ไม่พบข้อมูลการชำระเงิน"
        await payment.update({ status: 'Paid' });// ใช้คำสั่ง update() เพื่ออัปเดตสถานะของการชำระเงินที่ค้นพบเป็น "Paid" เพื่อระบุว่างวดการชำระเงินนี้ได้รับการชำระเงินแล้ว

        const allPayments = await Payment.findAll({//สร้างตัวแปร allPayments เก็บค่าที่ดึงข้อมูลการชำระเงินทั้งหมดที่เชื่อมโยงกับสัญญาเงินกู้เดียวกันกับการชำระเงินที่เพิ่งถูกยืนยัน
            where: { loan_id: payment.loan_id }//ใช้คำสั่ง where เพื่อกำหนดเงื่อนไขในการดึงข้อมูลการชำระเงิน โดยจะดึงเฉพาะการชำระเงินที่มี loan_id ตรงกับ loan_id ของการชำระเงินที่เพิ่งถูกยืนยัน
        });
        const isAllPaid = allPayments.every(p => p.status === 'Paid');//ใช้คำสั่ง every() เพื่อตรวจสอบว่าทุกการชำระเงินที่ดึงมาใน allPayments มีสถานะเป็น "Paid" หรือไม่ 
        //                                                               หากทุกการชำระเงินมีสถานะเป็น "Paid" จะได้ค่า true ในตัวแปร isAllPaid
        if (isAllPaid) {//ตรวจสอบว่าทุกการชำระเงินมีสถานะเป็น "Paid" หรือไม่ หากใช่จะทำงานในบล็อกนี้
            await Loan.update(//ใช้คำสั่ง update() เพื่ออัปเดตสถานะของสัญญาเงินกู้ที่เชื่อมโยงกับการชำระเงินนี้เป็น "ปิดยอดแล้ว" 
            // เพื่อระบุว่าสัญญาเงินกู้ได้ถูกปิดยอดแล้วเนื่องจากทุกงวดการชำระเงินได้รับการชำระเงินครบถ้วน
                { status: 'ปิดยอดแล้ว' }, // ข้อมูลที่ใช้ในการอัปเดต โดยกำหนดให้ status เป็น "ปิดยอดแล้ว"
                { where: { loan_id: payment.loan_id } }//เงื่อนไขในการอัปเดต โดยจะอัปเดตเฉพาะสัญญาเงินกู้ที่มี loan_id ตรงกับ loan_id 
                //                                      ของการชำระเงินที่เพิ่งถูกยืนยัน
            );
        }
        res.send({ //ส่ง Response กลับไปหา Client เมื่อดำเนินการทุกอย่างเสร็จสิ้น
            payment, // ข้อมูลการชำระเงินที่ถูกอัปเดต
            // ข้อความยืนยันการทำงานสำเร็จ โดยจะแตกต่างกันไปตามสถานะของการชำระเงินทั้งหมด
            message: isAllPaid ? "ชำระครบทุกงวดแล้ว ระบบปิดยอดสัญญาอัตโนมัติ" : "ยืนยันการชำระเงินสำเร็จ" 
        });
    } catch (err) {//เมื่อเกิดข้อผิดพลาดในขั้นตอนการยืนยันการชำระเงินจะทำงานในบล็อกนี้
        console.error(err);//แสดงข้อความ error ในคอนโซล
        res.status(500).send(err.message);//ส่งสถานะ 500 พร้อมข้อความ error กลับไปยัง client เพื่อแจ้งว่าเกิดข้อผิดพลาดในการยืนยันการชำระเงิน
    }
});


// API CRUD สำหรับ Savings
app.get("/savings", async (req, res) => {// app.get คือกำหนดเส้นทางดึงข้อมูลรายการเงินฝากจาก url "localhost/หมายเลขport/savings" 
//                                          เมื่อมีการเรียกใช้งานเส้นทางนี้จะทำงานในบล็อกนี้
    try {//ใช้ try-catch เพื่อจัดการกับข้อผิดพลาดที่อาจเกิดขึ้นในขั้นตอนการดึงข้อมูลรายการเงินฝาก
        const savings = await Saving.findAll({ include: [Member] });// ใช้คำสั่ง findAll() เพื่อดึงข้อมูลทั้งหมดจากตาราง Saving 
        //                                                          พร้อมกับข้อมูลสมาชิกที่เกี่ยวข้อง โดยใช้ include เพื่อเชื่อมโยงข้อมูลจากตาราง Member
        res.json(savings);// ส่งข้อมูลรายการเงินฝากที่ดึงมาได้กลับไปให้ผู้เรียกใช้งาน (Client) ในรูปแบบ JSON
    } catch (err) { res.status(500).send(err.message); }//เมื่อ error เกิดขึ้นจะส่งสถานะ 500 พร้อมข้อความ error
});


app.get("/members/:id/savings", async (req, res) => {// app.get คือกำหนดเส้นทางดึงข้อมูลรายการเงินฝากของสมาชิกจาก url "localhost/หมายเลขport/members/:id/savings" โดย :id 
//                                        เป็นตัวแปรที่ใช้แทนค่า member_id ที่ต้องการดึงข้อมูลรายการเงินฝาก เมื่อมีการเรียกใช้งานเส้นทางนี้จะทำงานในบล็อกนี้
    try {//ใช้ try-catch เพื่อจัดการกับข้อผิดพลาดที่อาจเกิดขึ้นในขั้นตอนการดึงข้อมูลรายการเงินฝากของสมาชิก
        const savings = await Saving.findAll({// ใช้คำสั่ง findAll() เพื่อดึงข้อมูลรายการเงินฝากทั้งหมดที่เชื่อมโยงกับสมาชิกที่มี member_id 
        //                                        ตรงกับค่าใน URL ผ่านตัวแปร req.params.id
            where: { member_id: req.params.id },//ใช้คำสั่ง where เพื่อกำหนดเงื่อนไขในการดึงข้อมูลรายการเงินฝาก โดยจะดึงเฉพาะรายการที่มี member_id 
            //                                    ตรงกับค่าใน URL ผ่านตัวแปร req.params.id
            order: [['createdAt', 'DESC']]//ใช้คำสั่ง order เพื่อกำหนดลำดับการแสดงผลของข้อมูลรายการเงินฝาก โดยจะเรียงลำดับจากวันที่สร้าง (createdAt)
        });
        res.json(savings);// ส่งข้อมูลรายการเงินฝากของสมาชิกที่ดึงมาได้กลับไปให้ผู้เรียกใช้งาน (Client) ในรูปแบบ JSON
    } catch (err) { res.status(500).send(err.message); }//เมื่อ error เกิดขึ้นจะส่งสถานะ 500 พร้อมข้อความ error
});

// สร้างรายการเงินฝากใหม่
app.post("/savings", async (req, res) => {// app.post คือกำหนดเส้นทางสำหรับสร้างรายการเงินฝากใหม่จาก url "localhost/หมายเลขport/savings" 
// เมื่อมีการเรียกใช้งานเส้นทางนี้จะทำงานในบล็อกนี้
    try {//ใช้ try-catch เพื่อจัดการกับข้อผิดพลาดที่อาจเกิดขึ้นในขั้นตอนการดึงข้อมูลรายการเงินฝากของสมาชิก
        const newSaving = await Saving.create(req.body);//สั่งให้ Sequelize สร้างข้อมูลเงินฝากใหม่ลงในตาราง Saving โดยใช้ข้อมูลที่ส่งมาจากหน้าฟอร์ม (req.body)
        res.send(newSaving);//เมื่อบันทึกสำเร็จ ให้ส่งข้อมูลรายการเงินฝากชุดใหม่กลับไปเพื่อยืนยันการทำงาน
    } catch (err) { res.status(500).send(err.message); }//หากเกิดข้อผิดพลาดในการบันทึก ให้ส่งสถานะ 500 พร้อมข้อความแจ้งสาเหตุของข้อผิดพลาดนั้น
});

// ลบรายการเงินฝาก
app.delete("/savings/:id", async (req, res) => {// app.delete คือกำหนดเส้นทางสำหรับลบรายการเงินฝากจาก url "localhost/หมายเลขport/savings/:id" 
//                                                โดย :id เป็นตัวแปรที่ใช้แทนค่า saving_id ที่ต้องการลบข้อมูล เมื่อมีการเรียกใช้งานเส้นทางนี้จะทำงานในบล็อกนี้
    try {//ใช้ try-catch เพื่อจัดการกับข้อผิดพลาดที่อาจเกิดขึ้นในขั้นตอนการดึงข้อมูลรายการเงินฝากของสมาชิก
        const saving = await Saving.findByPk(req.params.id);//// ค้นหาข้อมูลเงินฝากที่ต้องการลบโดยใช้ Primary Key (ID) จาก URL
        if (saving) await saving.destroy();// ถ้าพบข้อมูล (saving ไม่เป็น null) ให้ทำการลบแถวข้อมูลนั้นออกจากฐานข้อมูล
        res.send("Deleted Success");// ส่งข้อความแจ้งว่าลบข้อมูลสำเร็จแล้ว
    } catch (err) { res.status(500).send(err.message); }// หากเกิดข้อผิดพลาด ให้ส่งสถานะ 500 พร้อมรายละเอียดข้อผิดพลาด
});

app.put("/savings/:id", async (req, res) => {// app.put คือกำหนดเส้นทางสำหรับอัปเดตข้อมูลรายการเงินฝากจาก url "localhost/หมายเลขport/savings/:id" 
//                                                โดย :id เป็นตัวแปรที่ใช้แทนค่า saving_id ที่ต้องการอัปเดตข้อมูล เมื่อมีการเรียกใช้งานเส้นทางนี้จะทำงานในบล็อกนี้
    try {//ใช้ try-catch เพื่อจัดการกับข้อผิดพลาดที่อาจเกิดขึ้นในขั้นตอนการอัปเดตข้อมูลรายการเงินฝาก
        const saving = await Saving.findByPk(req.params.id);//ค้นหาข้อมูลเงินฝากเดิมที่ต้องการแก้ไขโดยใช้ ID
        if (!saving) return res.status(404).send("Saving record not found");//หากไม่พบข้อมูล ให้ส่งสถานะ 404 แจ้งว่าไม่พบรายการ
        await saving.update(req.body);//หากพบข้อมูล ให้ทำการอัปเดตด้วยข้อมูลใหม่ที่ส่งมาจากหน้าฟอร์ม (req.body)
        res.send(saving);//ส่งข้อมูลที่ถูกแก้ไขแล้วกลับไปเพื่อยืนยัน
    } catch (err) {
        res.status(500).send(err.message);// หากเกิดข้อผิดพลาดในการบันทึก ให้ส่งสถานะ 500 พร้อมข้อความแจ้งสาเหตุของข้อผิดพลาดนั้น
    }
});
app.get("/savings/:id", async (req, res) => {// app.get คือกำหนดเส้นทางดึงข้อมูลรายการเงินฝากจาก url "localhost/หมายเลขport/savings/:id" โดย :id 
// เป็นตัวแปรที่ใช้แทนค่า saving_id ที่ต้องการดึงข้อมูล เมื่อมีการเรียกใช้งานเส้นทางนี้จะทำงานในบล็อกนี้
    try {//ใช้ try-catch เพื่อจัดการกับข้อผิดพลาดที่อาจเกิดขึ้นในขั้นตอนการดึงข้อมูลรายการเงินฝาก
        const saving = await Saving.findByPk(req.params.id, { include: [Member] });// ใช้คำสั่ง findByPk() เพื่อค้นหาข้อมูลรายการเงินฝากตาม primary key (saving_id) 
        // ที่ระบุใน URL ผ่านตัวแปร req.params.id
        if (!saving) return res.status(404).send("Saving record not found");//หากไม่พบข้อมูล ให้ส่งสถานะ 404 แจ้งว่าไม่พบรายการ
        res.json(saving);//ส่งข้อมูลรายการเงินฝากที่ดึงมาได้กลับไปให้ผู้เรียกใช้งาน (Client) ในรูปแบบ JSON
    } catch (err) {//เมื่อ error เกิดขึ้นจะทำงานในบล็อกนี้
        res.status(500).send(err.message);//ส่งสถานะ 500 พร้อมข้อความ error กลับไปยัง client เพื่อแจ้งว่าเกิดข้อผิดพลาดในการดึงข้อมูลรายการเงินฝาก
    }
});