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

  amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  payment_date: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
const Saving = sequelize.define("saving", {
  saving_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  .sync({ alter: true })
  .then(() => {
    const port = process.env.PORT || 3000;
    console.log("Create Database SafeFund Success");
    app.listen(port, () =>
      console.log(`BackEnd SafeFund Run http://localhost:${port}`),
    );
  })
  .catch((err) => console.log("Can not Run Becaruse : " + err));

app.get("/members", (req, res) => {
  Member.findAll()
    .then((member) => {
      res.json(member);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get("/members/:id", (req, res) => {
  Member.findByPk(req.params.id)
    .then((member) => {
      if (!member) {
        res.status(404).send("Member Not Found");
      } else {
        res.json(member);
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
app.post("/members", (req, res) => {
  Member.create(req.body)
    .then((member) => {
      res.send(member);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
app.put("/members/:id", (req, res) => {
  Member.findByPk(req.params.id)
    .then((member) => {
      if (!member) {
        res.status(404).send("Member Not Found");
      } else {
        member
          .update(req.body)
          .then(() => {
            res.send(member);
          })
          .catch((err) => {
            res.status(500).send(err);
          });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
app.delete("/members/:id", (req, res) => {
  Member.findByPk(req.params.id)
    .then((member) => {
      if (!member) {
        res.status(404).send("Member Not Found");
      } else {
        member
          .destroy()
          .then(() => {
            res.send("Member Deleted");
          })
          .catch((err) => {
            res.status(500).send(err);
          });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get("/loans", (req, res) => {
    Loan.findAll({ include: [Member] })
        .then((loans) => {
            console.log(JSON.stringify(loans, null, 2)); 
            res.json(loans);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});
app.get("/loans/:id", (req, res) => {
  Loan.findByPk(req.params.id, { include: [Member] })
    .then((loan) => {
      if (!loan) {
        res.status(404).send("Loan Contract Not Found");
      } else {
        res.json(loan);
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
app.post("/loans", (req, res) => {
  Loan.create(req.body)
    .then((loan) => {
      res.send(loan);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
app.put("/loans/:id", (req, res) => {
  Loan.findByPk(req.params.id)
    .then((loan) => {
      if (!loan) {
        res.status(404).send("Loan Contract Not Found");
      } else {
        loan
          .update(req.body)
          .then(() => {
            res.send(loan);
          })
          .catch((err) => {
            res.status(500).send(err);
          });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
app.delete("/loans/:id", (req, res) => {
  Loan.findByPk(req.params.id)
    .then((loan) => {
      if (!loan) {
        res.status(404).send("Loan Contract Not Found");
      } else {
        loan
          .destroy()
          .then(() => {
            res.send("Loan Contract Deleted");
          })
          .catch((err) => {
            res.status(500).send(err);
          });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
