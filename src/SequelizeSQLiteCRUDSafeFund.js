require('dotenv').config();
const express = require('express');
const Sequelize = require('sequelize');
const app = express();

app.use(express.json());

const sequelize = new Sequelize( 'database', 'username', 'password',{
    host: 'localhost',
    dialect: 'sqlite',
    storage: './Database/DBSafeFund.sqlite'
});

const Member = sequelize.define('Member',{
    member_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    member_name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    address:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    phone:{
        type: Sequelize.STRING,
        allowNull: false
    }
});
const Loan = sequelize.define('loan',{
    loan_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    loan_amount:{
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
    },
    interest_rate:{
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
    },
    status:{
        type: Sequelize.STRING,
        allowNull: false
    }
});
const Payment = sequelize.define('payment',{
    payment_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    amount:{
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
    },
    payment_date:{
        type: Sequelize.STRING,
        allowNull: false
    }
});
const Saving = sequelize.define('saving',{
    saving_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    deposit_amount:{
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
    },
    deposit_date:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

Member.hasMany(Saving,{foreignKey: 'member_id'});
Saving.belongsTo(Member,{foreignKey: 'member_id'});

Member.hasMany(Loan,{foreignKey: 'member_id'});
Loan.belongsTo(Member,{foreignKey: 'member_id'});

Loan.hasMany(Payment,{foreignKey: 'loan_id'});
Payment.belongsTo(Loan,{foreignKey: 'loan_id'});

sequelize.sync();


const port = process.env.PORT || 3000;
app.listen(port,() => console.log(`BackEnd SafeFund Run http://localhost:${port}`))