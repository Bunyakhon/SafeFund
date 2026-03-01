const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

const dbPath = path.resolve(__dirname, "../Database", "DBSafeFund.sqlite");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: dbPath,
    logging: false
});

// --- นิยาม Model ---
const Member = sequelize.define("Member", {
    member_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    member_name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.TEXT, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'Members' });

const Loan = sequelize.define("loan", {
    loan_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    member_id: { type: DataTypes.INTEGER, allowNull: false },
    loan_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    interest_rate: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    duration_months: { type: DataTypes.INTEGER, defaultValue: 12 },
    status: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'loans' });

const Payment = sequelize.define("payment", {
    payment_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    loan_id: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    payment_date: { type: DataTypes.STRING, allowNull: false },
    period: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
}, { tableName: 'payments' });

const Saving = sequelize.define("saving", {
    saving_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    member_id: { type: DataTypes.INTEGER, allowNull: false },
    deposit_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    deposit_date: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'savings' });

// ฟังก์ชันช่วยจัดรูปแบบวันที่เป็น DD/MM/YYYY (พ.ศ.)
function getFormattedDate(dateObj) {
    const d = String(dateObj.getDate()).padStart(2, '0');
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const y = dateObj.getFullYear() + 543;
    return `${d}/${m}/${y}`;
}

const firstNames = ["สมพงษ์", "วรัญญา", "กิตติพร", "บุญมี", "นงลักษณ์", "ธวัชชัย", "สิรินธร", "ประจวบ", "มาลี", "อุดม", "จิราพร", "วิรัช", "พัชรา", "โสภณ", "ชไมพร", "รังสรรค์", "ดาริกา", "สุรศักดิ์", "นวลจันทร์", "พิชัย"];
const lastNames = ["รัตนพงศ์", "ทองประเสริฐ", "เจริญสุข", "ศิริชัย", "วิจิตรจันทร์", "มณีรัตน์", "ชูธรรม", "พงษ์พานิช", "บุญรอด", "แสงทอง"];
const districts = ["อ.เมือง", "อ.ศรีมหาโพธิ", "อ.กบินทร์บุรี", "อ.ประจันตคาม"];

async function runSeed() {
    try {
        console.log("🚀 เริ่มต้นการ Seed ข้อมูลใหม่แบบสมจริง...");
        await sequelize.sync({ force: true }); 

        // 1. สร้าง Member 20 รายการ
        const membersData = [];
        for (let i = 0; i < 20; i++) {
            membersData.push({
                member_name: `${firstNames[i]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
                address: `${Math.floor(Math.random() * 150) + 1}/${Math.floor(Math.random() * 10) + 1} หมู่ 2 ต.ท่าตูม ${districts[Math.floor(Math.random() * districts.length)]} จ.ปราจีนบุรี`,
                phone: `08${Math.floor(Math.random() * 9) + 1}-${Math.floor(1000000 + Math.random() * 9000000)}`
            });
        }
        const createdMembers = await Member.bulkCreate(membersData);
        console.log("✅ Member 20 รายการ: สำเร็จ");

        // 2. สร้าง Loan 10 สัญญา (สุ่มจากสมาชิก 20 คน)
        const loansData = [];
        const loanStatuses = ["อนุมัติแล้ว", "ปิดยอดแล้ว", "อนุมัติแล้ว", "อนุมัติแล้ว"];
        for (let i = 0; i < 10; i++) {
            loansData.push({
                member_id: createdMembers[i].member_id, // ใช้สมาชิก 10 คนแรกทำสัญญา
                loan_amount: (Math.floor(Math.random() * 6) + 1) * 5000, 
                interest_rate: 5.00,
                duration_months: 6,
                status: loanStatuses[Math.floor(Math.random() * loanStatuses.length)]
            });
        }
        const createdLoans = await Loan.bulkCreate(loansData);
        console.log("✅ Loan 10 สัญญา: สำเร็จ");

        // 3. สร้าง Payment สัมพันธ์กับ Loan (คำนวณรายงวด)
        const paymentsData = [];
        for (const loan of createdLoans) {
            const principal = parseFloat(loan.loan_amount);
            const interest = principal * (parseFloat(loan.interest_rate) / 100);
            const monthlyPayment = ((principal + interest) / loan.duration_months).toFixed(2);

            for (let p = 1; p <= loan.duration_months; p++) {
                const dueDate = new Date();
                dueDate.setMonth(dueDate.getMonth() + p);
                
                paymentsData.push({
                    loan_id: loan.loan_id,
                    amount: monthlyPayment,
                    period: p,
                    payment_date: getFormattedDate(dueDate),
                    status: loan.status === "ปิดยอดแล้ว" ? "Paid" : (p <= 2 ? "Paid" : "Pending")
                });
            }
        }
        await Payment.bulkCreate(paymentsData);
        console.log("✅ Payment (รายงวดตามสัญญา): สำเร็จ");

        // 4. สร้าง Saving 50 รายการ (สุ่มสมาชิกคละกันทั้ง 20 คน)
        const savingsData = [];
        for (let i = 0; i < 50; i++) {
            const randomMember = createdMembers[Math.floor(Math.random() * createdMembers.length)];
            const depositDate = new Date();
            depositDate.setMonth(depositDate.getMonth() - Math.floor(Math.random() * 6)); // สุ่มย้อนหลัง 6 เดือน

            savingsData.push({
                member_id: randomMember.member_id,
                deposit_amount: (Math.floor(Math.random() * 5) + 1) * 100, // ฝาก 100-500
                deposit_date: getFormattedDate(depositDate)
            });
        }
        await Saving.bulkCreate(savingsData);
        console.log("✅ Saving 50 รายการ: สำเร็จ");

        console.log("\n✨ ข้อมูลติดตั้งเสร็จสิ้น! ทุกวันที่ใช้รูปแบบ / และปี พ.ศ. เรียบร้อยแล้ว ✨");
    } catch (error) {
        console.error("❌ ข้อผิดพลาด:", error);
    } finally {
        await sequelize.close();
        process.exit();
    }
}

runSeed();