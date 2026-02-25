const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

const dbPath = path.resolve(__dirname, "../Database", "DBSafeFund.sqlite");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: dbPath,
    logging: false
});

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


const firstNames = ["นิติ", "กมล", "วิไล", "สมภพ", "จิรา", "ภาณุ", "ศิริ", "ธนา", "เรไร", "ปรีชา", "สุนิสา", "มานะ", "พรทิพย์", "อนันต์", "วนิดา", "เกรียงศักดิ์", "นภา", "สุชาติ", "เยาวลักษณ์", "ไพโรจน์"];
const lastNames = ["รัตนากร", "เจริญศรี", "พงษ์พาณิชย์", "บุญมี", "จันทรโรจน์", "วิเศษสุข", "ทองคำ", "เกษมสันต์", "เลิศวิจิตร", "งามขำ"];
const districts = ["อ.เมือง", "อ.ศรีมหาโพธิ", "อ.กบินทร์บุรี"];

async function runSeed() {
    try {
        console.log("🚀 กำลังเริ่มต้นสร้างข้อมูล Seed...");
        await sequelize.sync({ force: true }); 

        const membersData = [];
        for (let i = 0; i < 20; i++) {
            membersData.push({
                member_name: `${firstNames[i]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
                address: `${Math.floor(Math.random() * 100) + 1}/${Math.floor(Math.random() * 20) + 1} ม.2 ${districts[Math.floor(Math.random() * districts.length)]} จ.ปราจีนบุรี`,
                phone: `08${Math.floor(Math.random() * 9) + 1}-${Math.floor(1000000 + Math.random() * 9000000)}`
            });
        }
        const createdMembers = await Member.bulkCreate(membersData);
        console.log("✅ สร้าง Member: 20 รายการ");

        const loansData = [];
        const loanMemberIndices = [0, 5, 10, 15, 19];
        for (let i = 0; i < 5; i++) {
            loansData.push({
                member_id: createdMembers[loanMemberIndices[i]].member_id,
                loan_amount: (Math.floor(Math.random() * 5) + 1) * 10000, 
                interest_rate: 5.00,
                duration_months: 12,
                status: "อนุมัติแล้ว"
            });
        }
        const createdLoans = await Loan.bulkCreate(loansData);
        console.log("✅ สร้าง Loan: 5 รายการ");

        
        const paymentsData = [];
        for (const loan of createdLoans) {
            const monthlyPrincipal = parseFloat(loan.loan_amount) / 12;
            const interest = (parseFloat(loan.loan_amount) * (parseFloat(loan.interest_rate) / 100)) / 12;
            const totalMonthly = (monthlyPrincipal + interest).toFixed(2);

            for (let p = 1; p <= 4; p++) { 
                paymentsData.push({
                    loan_id: loan.loan_id,
                    amount: totalMonthly,
                    period: p,
                    payment_date: `2024-0${p + 1}-15`,
                    status: p <= 2 ? "Paid" : "Pending" 
                });
            }
        }
        await Payment.bulkCreate(paymentsData);
        console.log("✅ สร้าง Payment: 20 รายการ (4 งวดต่อสัญญา)");

        const savingsData = [];
        for (const member of createdMembers) {
            for (let s = 1; s <= 5; s++) {
                savingsData.push({
                    member_id: member.member_id,
                    deposit_amount: 500.00, 
                    deposit_date: `2024-0${s}-05`
                });
            }
        }
        await Saving.bulkCreate(savingsData);
        console.log("✅ สร้าง Saving: 100 รายการ (5 ครั้งต่อสมาชิก)");

        console.log("\n✨ ติดตั้งข้อมูลทดสอบเสร็จสมบูรณ์!");
    } catch (error) {
        console.error("❌ เกิดข้อผิดพลาด:", error);
    } finally {
        await sequelize.close();
        process.exit();
    }
}

runSeed();