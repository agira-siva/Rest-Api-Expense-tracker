const Income = require("../models/income");
const {db_collection} = require("../util/database");


exports.addIncomeForm = (req,res,next) => {
    res.status(200).send({message: "add income via post request"});
}

exports.addIncome = async (req,res,next) => {
    const incomeCollection = db_collection().collection("income");
    const {userId} = req.params;
    month = Number(req.query.month);
    year = Number(req.query.year);
    card = Number(req.body.card);
    cash = Number(req.body.cash);
    const income = new Income(card,cash,month,year,userId);
    const incomeData = await incomeCollection.find({month, year, userId}).toArray();
    console.log(incomeData);
    if(incomeData.length == 0){
        await income.saveIncome(incomeCollection);
        res.status(201).send({message: "income added", income: {card, cash, month, year}});
    }
    else{
        const {cardAmount, cashAmount} = await income.updateIncome(incomeCollection,incomeData[0].card, incomeData[0].cash);
        res.status(204).send({message: "income updated successfully", income: {card: cardAmount, cash: cashAmount, month, year} });
    }
}