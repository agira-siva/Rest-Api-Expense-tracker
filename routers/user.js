const express = require("express");
const router = express.Router();
const routes = require("../controllers/user")
const incomeroutes = require("../controllers/income");
const expenseroutes = require("../controllers/expense");
const auth = require("../middleware/auth");

router.get("/", auth,  routes.redirect); 

router.get("/:userId/addIncome",  incomeroutes.addIncomeForm);

router.post("/:userId/addIncome", auth, incomeroutes.addIncome);

router.get("/:userId/addExpense", expenseroutes.addExpenseForm);

router.post("/:userId/addExpense", auth, expenseroutes.addExpense);

router.post("/:userId/deleteExpense",auth, expenseroutes.deleteExpense);

router.post("/:userId/updateExpense", expenseroutes.prePopulateExpense);

router.post("/:userId/updateExpense/:expenseId", auth, expenseroutes.updateUpdateExpense);

router.get("/:userId", auth, routes.listUserExpenses);

router.post("/:userId/month", auth, routes.listUserExpensesParticularMonth);

module.exports = router;