const Expense = require("../models/expense");
const {db_collection} = require("../util/database");

exports.addExpenseForm = (req,res,next) => {
    const userId = req.params.userId;
    res.render("addExpense", {userId : userId});
};

exports.addExpense = async (req,res,next) => {
    const expenseCollection = db_collection().collection("expense");
    const userId = req.params.userId;
    const {amount,mode,category,description,date,month,year} = req.body;
    const expense = new Expense(amount, mode,category, description, userId, date, year, month);
    const expenseId = await expense.save(expenseCollection);
    res.status(201).send({message: "expense added", expenseId});
}

exports.deleteExpense = async (req,res,next) => {
    const expenseCollection = db_collection().collection("expense");
    const expenseId = req.params.expenseId;
    console.log(expenseId);
    Expense.delete(expenseCollection,expenseId);
    res.status(204).send({message: "expense deleted successfully"});
}


exports.prePopulateExpense = (req,res,next) => {
    const data = req.body;
    console.log(data);
    const userId = req.params.userId;
    console.log(userId);
    const dateString = data.year + "-" + (data.month).padStart(2,"0") + "-" + (data.date[0]).padStart(2,"0") + "T" + "12:24"; 
    console.log(dateString);
    console.log(data.description);
    res.render("updateExpense", {data: data, dateString: dateString, userId: userId});
}

exports.updateUpdateExpense  = async (req,res,next) => {
    const expenseId = req.params.expenseId
    const expenseCollection = db_collection().collection("expense");
    const expenseBody = req.body;
    const {date, month,year, amount,mode,category,description} = expenseBody;
    await Expense.updateExpense(expenseCollection,expenseBody, expenseId);
    res.status(201).send({message: "expense updated successfully", expense: {
        date: Number(date),
        month: Number(month),
        year: Number(year),
        amount: Number(amount),
        mode,category,description}
    });
    // res.redirect("/user/" + req.params.userId + "?month=" + monthNumber + "&year=" + yearNumber);
}