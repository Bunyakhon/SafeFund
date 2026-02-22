const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

// กำหนด Path ให้ตรงกับที่ Server เรียกใช้
const dbPath = path.resolve(__dirname, "../Database", "DBSafeFund.sqlite");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: dbPath,
    logging: false // ปิด log เพื่อให้เห็นสรุปชัดเจน
});

// --- นิยาม Model ---
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

const Saving = sequelize.define("saving", {
    saving_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    member_id: { type: DataTypes.INTEGER, allowNull: false },
    deposit_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    deposit_date: { type: DataTypes.STRING, allowNull: false },
});

// --- คลังข้อมูลสมมติสำหรับสุ่ม ---
const firstNames = ["สมชาย", "สมศรี", "วิชัย", "กิตติ", "นงลักษณ์", "ประเสริฐ", "วรวุฒิ", "อัญชลี", "ธนพล", "มณีรัตน์", "สัญชัย", "พิมล", "บุญส่ง", "รัตนา", "เฉลิม"];
const lastNames = ["ใจดี", "มีสุข", "รักไทย", "แสงสว่าง", "เจริญพร", "รุ่งเรือง", "มั่นคง", "ศรีสวัสดิ์", "พูนทรัพย์", "แก้วมณี", "ทองดี", "เปรมปรีดิ์"];
const districts = ["อ.เมือง", "อ.กบินทร์บุรี", "อ.ศรีมหาโพธิ", "อ.ประจันตคาม", "อ.นาดี"];

async function start() {
    try {
        console.log("🛠️ กำลังล้างและสร้างฐานข้อมูลใหม่ที่:", dbPath);
        await sequelize.sync({ force: true });

        // 1. สร้างสมาชิก 50 คนแบบสุ่มชื่อ
        const membersData = [];
        for (let i = 0; i < 50; i++) {
            const fname = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lname = lastNames[Math.floor(Math.random() * lastNames.length)];
            const dist = districts[Math.floor(Math.random() * districts.length)];
            membersData.push({
                member_name: `${fname} ${lname}`,
                address: `${Math.floor(Math.random() * 200) + 1} ม.${Math.floor(Math.random() * 10) + 1} ต.หน้าเมือง ${dist} จ.ปราจีนบุรี`,
                phone: `08${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`
            });
        }
        const createdMembers = await Member.bulkCreate(membersData);
        console.log("✅ ลงข้อมูลสมาชิก 50 คนสำเร็จ");

        // 2. สร้างเงินกู้ 10 รายการ (สุ่มจากสมาชิก 10 คน)
        const loansData = [];
        const loanStatuses = ["อนุมัติแล้ว", "รอพิจารณา", "ชำระครบแล้ว"];
        for (let i = 0; i < 10; i++) {
            loansData.push({
                member_id: createdMembers[i].member_id, // เลือก 10 คนแรกมาเป็นตัวอย่างกู้
                loan_amount: (Math.random() * 40000 + 10000).toFixed(2),
                interest_rate: (Math.random() * 5 + 3).toFixed(2),
                duration_months: 12,
                status: loanStatuses[Math.floor(Math.random() * loanStatuses.length)]
            });
        }
        await Loan.bulkCreate(loansData);
        console.log("✅ ลงข้อมูลเงินกู้ 10 รายการสำเร็จ");

        // 3. สร้างเงินฝากแบบคละกัน (สมาชิกทุกคนต้องมีอย่างน้อย 1-3 รายการ)
        const savingsData = [];
        const months = ["01/2569", "02/2569"];
        
        createdMembers.forEach(m => {
            const numDeposits = Math.floor(Math.random() * 2) + 1; // สุ่มฝากคนละ 1-2 ครั้ง
            for (let j = 0; j < numDeposits; j++) {
                savingsData.push({
                    member_id: m.member_id,
                    deposit_amount: (Math.random() * 1000 + 100).toFixed(2),
                    deposit_date: `${Math.floor(Math.random() * 28) + 1}/${months[j] || "02/2569"}`
                });
            }
        });
        await Saving.bulkCreate(savingsData);
        console.log(`✅ ลงข้อมูลเงินฝากคละกันจำนวน ${savingsData.length} รายการสำเร็จ`);

        console.log("\n✨ เสร็จสมบูรณ์! ข้อมูลทดสอบพร้อมใช้งานแล้วครับ");
        console.log("- ตรวจสอบหน้า Member เพื่อดูผลการแบ่งหน้า (Pagination)");
        console.log("- ตรวจสอบหน้า Loan เพื่อดูสถานะเงินกู้ 10 รายการ");
        console.log("- ตรวจสอบหน้า Saving เพื่อดูยอดรวมสะสมแบบสุ่ม");

    } catch (err) {
        console.error("❌ เกิดข้อผิดพลาด:", err.message);
    } finally {
        await sequelize.close();
        process.exit();
    }
}

start();