const express = require("express");
const mainRouter= require("./routes/index");
const app = express();
const cors = require("cors") ;

app.use(cors());        //ALWAYS MIDDLEWARES (CORS ESPECIALLY) SHOULD BE ABOVE ROUTERS
app.use(express.json());
app.use("/api/v1" , mainRouter);   // all requests coming or starting form "api/v1" go to main router


app.listen(3000);