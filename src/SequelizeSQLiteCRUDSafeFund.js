require("dotenv").config();
const express = require("express");
const Sequelize = require("sequelize");
const app = express();

app.use(express.json());


const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  storage: "./Database/DBSafeFund.sqlite",
});

const Member = sequelize.define("Member", {
  member_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  member_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  address: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Loan = sequelize.define("loan", {
  loan_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  member_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  loan_amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  interest_rate: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  duration_months: {
    type: Sequelize.INTEGER,
    defaultValue: 12,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Payment = sequelize.define("payment", {
  payment_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  loan_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  payment_date: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  period: { 
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  status: { 
    type: Sequelize.STRING,
    defaultValue: 'Pending',
    allowNull: true,
  },
});

const Saving = sequelize.define("saving", {
  saving_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  member_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  deposit_amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  deposit_date: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});


Member.hasMany(Saving, { foreignKey: "member_id" });
Saving.belongsTo(Member, { foreignKey: "member_id" });

Member.hasMany(Loan, { foreignKey: "member_id" });
Loan.belongsTo(Member, { foreignKey: "member_id" });

Loan.hasMany(Payment, { foreignKey: "loan_id" });
Payment.belongsTo(Loan, { foreignKey: "loan_id" });


sequelize
  .sync({ alter: false }) 
  .then(() => {
    const port = process.env.PORT || 3000;
    console.log("Create Database SafeFund Success");
    app.listen(port, () =>
      console.log(`BackEnd SafeFund Run http://localhost:${port}`),
    );
  })
  .catch((err) => console.log("Can not Run Because : " + err));


app.get("/members", (req, res) => {
  Member.findAll()
    .then((member) => res.json(member))
    .catch((err) => res.status(500).send(err));
});

app.get("/members/:id", (req, res) => {
  Member.findByPk(req.params.id)
    .then((member) => {
      if (!member) res.status(404).send("Member Not Found");
      else res.json(member);
    })
    .catch((err) => res.status(500).send(err));
});

app.post("/members", (req, res) => {
  Member.create(req.body)
    .then((member) => res.send(member))
    .catch((err) => res.status(500).send(err));
});

app.put("/members/:id", (req, res) => {
  Member.findByPk(req.params.id)
    .then((member) => {
      if (!member) res.status(404).send("Member Not Found");
      else {
        member.update(req.body)
          .then(() => res.send(member))
          .catch((err) => res.status(500).send(err));
      }
    })
    .catch((err) => res.status(500).send(err));
});

app.delete("/members/:id", (req, res) => {
  Member.findByPk(req.params.id)
    .then((member) => {
      if (!member) res.status(404).send("Member Not Found");
      else {
        member.destroy()
          .then(() => res.send("Member Deleted"))
          .catch((err) => res.status(500).send(err));
      }
    })
    .catch((err) => res.status(500).send(err));
});

// --- API Routes สำหรับ Loans ---

app.get("/loans", (req, res) => {
  Loan.findAll({ 
    include: [Member, Payment] 
  })
    .then((loans) => res.json(loans))
    .catch((err) => res.status(500).send(err));
});

app.get("/loans/:id", (req, res) => {
  Loan.findByPk(req.params.id, { 
    include: [
      { model: Member }, 
      { model: Payment } 
    ]
  })
    .then((loan) => {
      if (!loan) res.status(404).send("Loan Contract Not Found");
      else {
        // ทำการ Sort ข้อมูล Payment ตามงวดที่ในระดับ JavaScript แทนเพื่อความชัวร์
        if (loan.payments) {
            loan.payments.sort((a, b) => a.period - b.period);
        }
        res.json(loan);
      }
    })
    .catch((err) => {
      console.error(err); // ดู Error ที่ Console ของ Backend
      res.status(500).send(err.message);
    });
});

app.post("/loans", async (req, res) => {
  try {
    const loan = await Loan.create(req.body);
    const principal = parseFloat(loan.loan_amount);
    const interestRate = parseFloat(loan.interest_rate) / 100;
    const months = parseInt(loan.duration_months);
    const totalInterest = principal * interestRate;
    const totalAmount = principal + totalInterest;
    const monthlyPayment = (totalAmount / months).toFixed(2);
    const payments = [];
    const startDate = new Date();

    for (let i = 1; i <= months; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(startDate.getMonth() + i);

      payments.push({
        loan_id: loan.loan_id,
        amount: monthlyPayment,
        period: i,
        payment_date: dueDate.toISOString().split('T')[0], 
        status: 'Pending'
      });
    }

    await Payment.bulkCreate(payments);

    res.status(201).send(loan);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.put("/loans/:id", async (req, res) => {
  try {
    // 1. ค้นหาสัญญาเงินกู้เดิมก่อน
    const loan = await Loan.findByPk(req.params.id);
    if (!loan) return res.status(404).send("ไม่พบสัญญาเงินกู้");

    // 2. ตรวจสอบว่ามีการชำระเงินในงวดใดงวดหนึ่งไปแล้วหรือยัง (Status เป็น 'Paid')
    // เพื่อป้องกันการคำนวณใหม่ทับข้อมูลการเงินที่เกิดขึ้นจริงแล้ว
    const paidPayments = await Payment.count({ 
      where: { 
        loan_id: loan.loan_id, 
        status: 'Paid' 
      } 
    });

    if (paidPayments > 0) {
      // หากมีการจ่ายเงินแล้ว แนะนำให้แก้ไขได้เฉพาะสถานะสัญญา (Status) 
      // แต่ไม่ควรให้แก้ไข ยอดเงิน, ดอกเบี้ย หรือ จำนวนเดือน เพราะจะกระทบงวดที่จ่ายไปแล้ว
      return res.status(400).send("ไม่สามารถแก้ไขรายละเอียดการเงินได้ เนื่องจากมีการชำระเงินเข้ามาแล้วบางงวด");
    }

    // 3. หากยังไม่มีการชำระเงินเลย สามารถอัปเดตและคำนวณงวดใหม่ได้
    await loan.update(req.body);

    // 4. ลบงวดการชำระเงินเก่าทิ้งทั้งหมดเพื่อสร้างใหม่ตามเงื่อนไขที่ถูกแก้ไข
    await Payment.destroy({ where: { loan_id: loan.loan_id } });

    // 5. เริ่มคำนวณยอดชำระรายเดือนใหม่
    const principal = parseFloat(loan.loan_amount);
    const interestRate = parseFloat(loan.interest_rate) / 100;
    const months = parseInt(loan.duration_months);
    
    const totalInterest = principal * interestRate;
    const totalAmount = principal + totalInterest;
    const monthlyPayment = (totalAmount / months).toFixed(2);

    const payments = [];
    const startDate = new Date(loan.createdAt);

    // กำหนดสถานะตั้งต้นของงวดใหม่ 
    // ถ้าผู้ใช้เปลี่ยนสถานะสัญญาเป็น 'ปิดยอดแล้ว' ให้ตั้งทุกงวดเป็น 'Paid'
    const paymentStatus = loan.status === 'ปิดยอดแล้ว' ? 'Paid' : 'Pending';

    for (let i = 1; i <= months; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(startDate.getMonth() + i);

      payments.push({
        loan_id: loan.loan_id,
        amount: monthlyPayment,
        period: i,
        payment_date: dueDate.toISOString().split('T')[0],
        status: paymentStatus
      });
    }

    // 6. บันทึกงวดการชำระใหม่ลงฐานข้อมูลพร้อมกัน (Bulk Create)
    await Payment.bulkCreate(payments);

    res.send({
      message: "อัปเดตสัญญาและคำนวณงวดชำระใหม่เรียบร้อยแล้ว",
      loan: loan
    });

  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตสัญญา:", err);
    res.status(500).send(err.message);
  }
});
app.put("/payments/:id/confirm", async (req, res) => {
    try {
        // 1. ค้นหารายการชำระเงินที่ต้องการยืนยัน
        const payment = await Payment.findByPk(req.params.id);
        if (!payment) return res.status(404).send("ไม่พบข้อมูลการชำระเงิน");
        
        // 2. อัปเดตสถานะงวดนี้เป็น 'Paid'
        await payment.update({ status: 'Paid' });

        // 3. ตรวจสอบงวดชำระทั้งหมดของสัญญานี้ (loan_id)
        const allPayments = await Payment.findAll({
            where: { loan_id: payment.loan_id }
        });

        // 4. เช็คว่าทุกงวดเปลี่ยนเป็น 'Paid' ครบหรือยัง
        const isAllPaid = allPayments.every(p => p.status === 'Paid');

        // 5. ถ้าจ่ายครบทุกงวดแล้ว ให้ไปอัปเดตตาราง loans
        if (isAllPaid) {
            await Loan.update(
                { status: 'ปิดยอดแล้ว' }, 
                { where: { loan_id: payment.loan_id } }
            );
        }

        res.send({ 
            payment, 
            message: isAllPaid ? "ชำระครบทุกงวดแล้ว ระบบปิดยอดสัญญาอัตโนมัติ" : "ยืนยันการชำระเงินสำเร็จ" 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});
app.delete("/loans/:id", (req, res) => {
  Loan.findByPk(req.params.id)
    .then((loan) => {
      if (!loan) res.status(404).send("Loan Contract Not Found");
      else {
        loan.destroy()
          .then(() => res.send("Loan Contract Deleted"))
          .catch((err) => res.status(500).send(err));
      }
    })
    .catch((err) => res.status(500).send(err));
});

// ดึงรายการเงินฝากทั้งหมดพร้อมข้อมูลสมาชิก
// ดึงรายการเงินฝากทั้งหมดพร้อมข้อมูลสมาชิก
app.get("/savings", async (req, res) => {
    try {
        const savings = await Saving.findAll({ include: [Member] });
        res.json(savings);
    } catch (err) { res.status(500).send(err.message); }
});

// เพิ่ม API เพื่อดึงประวัติเงินฝากของสมาชิกแต่ละคน
app.get("/members/:id/savings", async (req, res) => {
    try {
        const savings = await Saving.findAll({
            where: { member_id: req.params.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(savings);
    } catch (err) { res.status(500).send(err.message); }
});

// สร้างรายการเงินฝากใหม่
app.post("/savings", async (req, res) => {
    try {
        const newSaving = await Saving.create(req.body);
        res.send(newSaving);
    } catch (err) { res.status(500).send(err.message); }
});

// ลบรายการเงินฝาก
app.delete("/savings/:id", async (req, res) => {
    try {
        const saving = await Saving.findByPk(req.params.id);
        if (saving) await saving.destroy();
        res.send("Deleted Success");
    } catch (err) { res.status(500).send(err.message); }
});

app.put("/savings/:id", async (req, res) => {
    try {
        const saving = await Saving.findByPk(req.params.id);
        if (!saving) return res.status(404).send("Saving record not found");
        await saving.update(req.body);
        res.send(saving);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
app.get("/savings/:id", async (req, res) => {
    try {
        const saving = await Saving.findByPk(req.params.id, { include: [Member] });
        if (!saving) return res.status(404).send("Saving record not found");
        res.json(saving);
    } catch (err) {
        res.status(500).send(err.message);
    }
});