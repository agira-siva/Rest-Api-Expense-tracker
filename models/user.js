const {db_collection} = require("../util/database");

module.exports = class User {
    constructor(email,password){
        this.email = email;
        this.password = password;
    }

    async save(){
        const users = db_collection().collection("users");
        await users.insertOne({"email" : this.email, "password": this.password});
        console.log("inserted");
    }

    static async getUserId(email){
        const data = await db.execute("select userId from users where userName = ?",[username]);
        return data[0][0].userId;
    }

    static async checkemailExists(email, value) {
        try{
            const users = db_collection().collection("users");
            console.log(email);
            const exists =  await users.findOne({email : email});
            console.log("database",exists);
            if(exists === null){
                return false;
            }
            return value ? exists : true;  
        }catch(err) {
            console.log(err);
        }
    }

    

}