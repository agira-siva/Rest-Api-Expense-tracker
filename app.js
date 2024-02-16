const express = require("express");
const app = express();
const {executeStudentCrudOperations} = require("./util/database");
const routes = require("./routers/routes");
const userroutes = require("./routers/user");


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));

app.set("view engine","ejs");
app.set("views", "views");
app.use("/", routes);
app.use("/user",  userroutes);

executeStudentCrudOperations();

app.use((req,res,next) => {
    res.status(404).send("page not found");
});

app.listen(13000);