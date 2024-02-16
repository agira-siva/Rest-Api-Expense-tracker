const {MongoClient} = require("mongodb");
const {config} = require("dotenv");
const Income = require("../models/income");
config()

let db;

async function connectToCluster(uri) {
    let mongoClient;
 
    try {
        mongoClient = new MongoClient(uri);
        console.log('Connecting to MongoDB Atlas cluster...');
        await mongoClient.connect();
        console.log('Successfully connected to MongoDB Atlas!');
 
        return mongoClient;
    } catch (error) {
        console.log('Connection to MongoDB Atlas failed!', error);
        process.exit();
    }
 }

async function executeStudentCrudOperations() {
    const uri = process.env.DB_URI;
    let mongoClient;
 
    try {
        mongoClient = await connectToCluster(uri);
        db = mongoClient.db("expenseTracker");

    } catch{
        console.log("error");
    }
 }


 function db_collection(){
    if(db){
        return db;
    }
    throw new error("db not found");
 }

 module.exports.db_collection = db_collection;
 module.exports.executeStudentCrudOperations = executeStudentCrudOperations;


 

 

 


