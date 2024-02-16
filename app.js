const express = require("express");
const app = express();
const {connectToDatabase} = require("./util/database");
const routes = require("./routers/routes");
const userroutes = require("./routers/user");
const port = process.env.PORT || 4000;

app.use(express.urlencoded({extended: false}));
app.use("/", routes);
app.use("/user",  userroutes);

app.use((req,res,next) => {
    res.status(404).send("page not found");
});

connectToDatabase();

app.listen(port);
