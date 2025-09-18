const express = require("express");
const dontenv = require("dotenv");
const userRouter = require("./routers/User")
const taskRouter = require("./routers/taskRoutes")


dontenv.config()
const app = express();
const PORT = process.env.PORT ;


app.use(express.json())


app.use("/users" , userRouter)
app.use("/tasks" , taskRouter)
app.listen(PORT , (req, res)=>{
    console.log(`listening at  http://localhost:${PORT}`)
})