const { ObjectId } = require('mongodb');

module.exports = class Expense{
    constructor(amount, mode,category,description,userId,date,year,month){
        this.amount = Number(amount);
        this.date = Number(date);
        this.year = Number(year);
        this.month = Number(month);
        this.userId = userId;
        this.category = category;
        this.description = description;
        this.mode = mode;
    }

    async save(expenseCollection){
        const data = await expenseCollection.insertOne({userId: this.userId,amount: this.amount, date: this.date, month: this.month, year: this.year, category: this.category, mode: this.mode, description: this.description});
        console.log("expenses insertion successful");
        return data.insertedId.toString();
    }

    static async delete(expenseCollection,expenseId){
        const objectId = new ObjectId(expenseId);
        const data = await expenseCollection.deleteOne({_id: objectId});
        console.log(data);
    }

    static async updateExpense(expenseCollection,expenseBody, expenseId){
        console.log(expenseBody,expenseId);
        const {date, month,year, amount,mode,category,description} = expenseBody;
        const objectId = new ObjectId(expenseId);
        await expenseCollection.updateOne({ _id: objectId }, {$set: {date: Number(date),month: Number(month),year: Number(year),amount: Number(amount),mode,category,description}});
        console.log("db executed successfully");
    
    }
}