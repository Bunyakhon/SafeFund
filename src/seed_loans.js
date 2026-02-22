const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

// กำหนด Path ให้ตรงกับที่ Server เรียกใช้
const dbPath = path.resolve(__dirname, "../Database", "DBSafeFund.sqlite");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: dbPath,
    logging: false
});

// --- นิยาม Model ให้ตรงกับ Backend ---
const Member = sequelize.define("Member", {
    member_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    member_name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.TEXT, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
});

const Loan = sequelize.define("loan", {
    loan_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    member_id: { type: DataTypes.INTEGER, allowNull: false },
    loan_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    interest_rate: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    duration_months: { type: DataTypes.INTEGER, defaultValue: 12 },
    status: { type: DataTypes.STRING, allowNull: false },
});

const Payment = sequelize.define("payment", {
    payment_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    loan_id: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    payment_date: { type: DataTypes.STRING, allowNull: false },
    period: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
});

const Saving = sequelize.define("saving", {
    saving_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    member_id: { type: DataTypes.INTEGER, allowNull: false },
    deposit_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    deposit_date: { type: DataTypes.STRING, allowNull: false },
});

// --- คลังข้อมูลสมมติ ---
const firstNames = ["สมชาย", "สมศรี", "วิชัย", "กิตติ", "นงลักษณ์", "ประเสริฐ", "วรวุฒิ", "อัญชลี", "ธนพล", "มณีรัตน์", "สัญชัย", "พิมล", "บุญส่ง", "รัตนา", "เฉลิม", "เอกราช", "อรอนงค์", "เกรียงไกร", "สุรพล", "วิภา"];
const lastNames = ["ใจดี", "มีสุข", "รักไทย", "แสงสว่าง", "เจริญพร", "รุ่งเรือง", "มั่นคง", "ศรีสวัสดิ์", "พูนทรัพย์", "แก้วมณี", "ทองดี", "เปรมปรีดิ์", "รักษาดี", "สิริโชติ", "บุญหนัก"];
const districts = ["อ.เมือง", "อ.กบินทร์บุรี", "อ.ศรีมหาโพธิ", "อ.ประจันตคาม", "อ.นาดี"];

async function start() {
    try {
        console.log("🛠️ กำลังล้างและสร้างฐานข้อมูลใหม่...");
        await sequelize.sync({ force: true });

        // 1. สร้างสมาชิก 50 คน
        const membersData = [];
        for (let i = 0; i < 50; i++) {
            const fname = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lname = lastNames[Math.floor(Math.random() * lastNames.length)];
            const dist = districts[Math.floor(Math.random() * districts.length)];
            membersData.push({
                member_name: `${fname} ${lname}`,
                address: `${Math.floor(Math.random() * 200) + 1} ม.${Math.floor(Math.random() * 10) + 1} ต.หน้าเมือง ${dist} จ.ปราจีนบุรี`,
                phone: `08${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
            });
        }
        const createdMembers = await Member.bulkCreate(membersData);
        console.log("✅ สมาชิก 50 คน: เรียบร้อย");

        // 2. สร้างเงินกู้ และ "ตารางผ่อนชำระ" สำหรับแต่ละคน
        console.log("⏳ กำลังสร้างสัญญาเงินกู้และคำนวณงวดชำระ...");
        const loanStatuses = ["อนุมัติแล้ว", "รอพิจารณา", "ปิดยอดแล้ว"];
        
        for (let i = 0; i < 15; i++) {
            const amount = (Math.random() * 40000 + 10000);
            const rate = (Math.random() * 5 + 3);
            const months = 12;
            const status = loanStatuses[Math.floor(Math.random() * loanStatuses.length)];

            const loan = await Loan.create({
                member_id: createdMembers[i].member_id,
                loan_amount: amount.toFixed(2),
                interest_rate: rate.toFixed(2),
                duration_months: months,
                status: status
            });

            // สร้าง Payment (ตารางผ่อน) สำหรับสัญญาคนนี้
            const monthlyPay = ((amount + (amount * (rate / 100))) / months).toFixed(2);
            const payments = [];
            for (let j = 1; j <= months; j++) {
                const date = new Date();
                date.setMonth(date.getMonth() + j);
                payments.push({
                    loan_id: loan.loan_id,
                    amount: monthlyPay,
                    period: j,
                    payment_date: date.toISOString().split('T')[0],
                    // ถ้าสถานะกู้คือ 'ปิดยอดแล้ว' ให้สุ่มว่าจ่ายแล้วทั้งหมด
                    status: status === "ปิดยอดแล้ว" ? "Paid" : (j <= 2 ? "Paid" : "Pending")
                });
            }
            await Payment.bulkCreate(payments);
        }
        console.log("✅ เงินกู้ 15 รายการพร้อมตารางผ่อน: เรียบร้อย");

        // 3. สร้างเงินฝาก
        const savingsData = [];
        createdMembers.forEach(m => {
            const numDeposits = Math.floor(Math.random() * 4) + 1;
            for (let j = 0; j < numDeposits; j++) {
                savingsData.push({
                    member_id: m.member_id,
                    deposit_amount: (Math.floor(Math.random() * 10) + 1) * 100, // สุ่ม 100, 200, ..., 1000
                    deposit_date: `${Math.floor(Math.random() * 28) + 1}/0${j + 1}/2567`
                });
            }
        });
        await Saving.bulkCreate(savingsData);
        console.log(`✅ เงินฝาก ${savingsData.length} รายการ: เรียบร้อย`);

        console.log("\n✨ ข้อมูลทดสอบถูกติดตั้งลงใน DBSafeFund.sqlite เรียบร้อยแล้ว!");

    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        await sequelize.close();
        process.exit();
    }
}

start();