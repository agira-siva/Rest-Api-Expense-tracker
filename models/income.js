const {db_collection} = require("../util/database");

module.exports = class Income {
    constructor(card,cash,month,year, userId){
        this.card = Number(card);
        this.cash = Number(cash);
        this.month = Number(month);
        this.year = Number(year);
        this.userId = userId;
    }


    async saveIncome(incomeCollection){
        const incomedata = await incomeCollection.insertOne({userId: this.userId, card: this.card, cash: this.cash, month: this.month, year: this.year});
        console.log(incomedata);
        console.log("new income inserted");
    }

    async updateIncome(incomeCollection,card, cash){
        const cardAmount = this.card + card;
        const cashAmount = this.cash + cash;
        console.log("value is",card,cardAmount,cash,cashAmount);
        await incomeCollection.updateOne({userId: this.userId, month: this.month, year: this.year}, {$set : {card: cardAmount, cash: cashAmount}});
        console.log("existing income updated successfully");
        return {cardAmount,cashAmount};
    }

    static updateIncome(expenseData){
        let cardAmount = 0;
        let cashAmount = 0;
        let expenses = 0;
        expenseData.forEach(expense => {
            if(expense.mode == "card"){
                cardAmount += expense.amount;
                
            }else{
                cashAmount += expense.amount;
            }
            expenses += expense.amount;
        })
        return {cardAmount,cashAmount,expenses};
    }

}