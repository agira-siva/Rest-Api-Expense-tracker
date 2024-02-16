const jwt = require('jsonwebtoken');
const User = require("../models/user");
const bcrypt = require("bcrypt");
const {validationResult} = require("express-validator");
const {db_collection} = require("../util/database");
const {config} = require("dotenv");
const Income = require("../models/income");
config()

exports.getUserName = async(req,res,next) => {
    res.send("hello world");
}

exports.signup = (req,res,next) => {
    res.status(200).json({message: "you are in signup page"});
}

exports.login = (req,res, next) => {
    res.status(200).json({message: "you are in login page"});
}

exports.logout = (req,res,next) =>{
    
}

exports.authenticateLogin = async (req,res,next) => {
    const {email,password} = req.body;
    const emailExists = await User.checkemailExists(email,1);
    // console.log("emailExists",emailExists, emailExists.password, password);
    if(emailExists != false ){
        const valid = await bcrypt.compare(password, emailExists.password);
        console.log("valid", valid);
        if(valid){
            let token = jwt.sign({ id: emailExists._id }, process.env.PRIVATE_KEY, { expiresIn: "10m" });
            res.setHeader("authorization-token", token);
            return res.status(200).send({message: "successfully loggedin ", userId: emailExists._id});
        }
        return res.status(401).send({message: "invalid password"});
    }

    return res.status(401).send({message: "email not found, go to signup to register an account"});
}

exports.authenticateSignup = async (req,res,next) => {
    
    const {email, password, confirmpassword } = req.body;
    console.log(email);
    const emailExists = await User.checkemailExists(email,0);
    console.log("email",emailExists);
    if(emailExists){
        return res.status(200).json({message: "email already exists, try to login"});
    } 
    
    if(password !== confirmpassword){
        return res.status(200).json({message : "password and confirm password not same"});
    }

    const hashedPassword = await bcrypt.hash(password,12);
    const newUser = new User(email, hashedPassword);
    await newUser.save();
    res.status(200).json({message: "account created successfully, go to login page to login"});
}

exports.listUserExpenses = async (req,res,next) => {
    const incomeCollection = db_collection().collection("income");
    const expenseCollection = db_collection().collection("expense");
    const userId = req.params.userId;
    const month = Number(req.query.month);
    const year = Number(req.query.year);
    console.log("month", month);
    if(isNaN(month) || isNaN(year)){
        return res.status(404).send({message: "invalid url"});
    }
    const response = {};
    const data = await incomeCollection.findOne({userId, month, year});
    if(data == null){
        console.log("siva");
        response.income = {
            cardAmount : 0,
            cashAmount : 0
        }
    }else{
        response.income = {
            cardAmount : data.card,
            cashAmount: data.cash,
            
        }
    }

    console.log(data);
    const expenseData = await expenseCollection.find({userId, month,year},{userId: 0}).sort({date: -1}).toArray();
    console.log("expense data", expenseData);
    if(expenseData.length==0){
        response.expense = {
            message: "no expenses found"
        }
    }else{
        response.expense = expenseData;
        const {cardAmount, cashAmount,expenses} = Income.updateIncome(expenseData);
        response.income = {
            cardAmount: (data?.card || 0) - cardAmount,
            cashAmount: (data?.cash || 0) - cashAmount,
            expenses: expenses
        }
    }

    return res.status(200).send(response);
    // const [expenseData] = await db.execute("select * from expenses where expenseUserId = ? and Month = ? and year = ? order by date desc ",[userId, month, year]);
    // if(expenseData.length != 0){
    //     const {cardAmount,cashAmount,expenses} = Income.updateIncome(expenseData);
    //     data[0].cardAmount -= cardAmount;
    //     data[0].cashAmount -= cashAmount;
    //     return res.render("userExpenses.ejs", {userId : userId,month: month,year: year,amount: data, expenseData: expenseData,expenses: expenses});
    // }else{
    //     return res.render("userExpenses.ejs", {userId : userId,month: month, year : year, amount: data, expenseData: expenseData,expenses: 0});

    // }
}

exports.listUserExpensesParticularMonth = async (req,res,next) => {
    const monthString = req.body.month;
    let [year, month] = monthString.split("-");
    year = Number(year);
    month = Number(month);
    const userId = req.params.userId;
    res.redirect("/user/" + userId + "?month=" + month + "&year=" + year);
}


exports.redirect = (req,res,next) => {
    res.redirect("/user/" + req.session.userId);
}

