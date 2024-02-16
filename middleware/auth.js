const {config} = require("dotenv");
const jwt = require('jsonwebtoken');
config()

module.exports = (req,res,next) => {
    const token = req.get('Authorization').split(" ")[1];
    try{
        const decoded = jwt.verify(token,process.env.PRIVATE_KEY);
        if(decoded.id == req.params.userId){
            return next();
        }
    }
    catch{(err) => {
            console.log(err);
            return res.status(404).send({message: "token expired, go to login to generate new token"});
        
    }}

    return res.status(404).send({message: "unauthorized access, go to login"});
}