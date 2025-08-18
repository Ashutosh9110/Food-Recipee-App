const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const connectDb = require("./config/connectionDb")
const cors = require("cors")
const passwordRoutes = require("./routes/passwordRoutes");


const PORT = process.env.PORT || 3000
connectDb()

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

app.use("/api", require("./routes/user"))   
app.use("/recipe", require("./routes/recipe")) 
app.use("/api/password", passwordRoutes);

app.get("/debug-routes", (req, res) => {
    res.json({ msg: "password routes mounted" });
  });

app.use((req, res) => {
    res.status(404).send({ error: "Not Found" })
})

app.use((req, res, next) => {
    console.log(`Received ${req.method} request at ${req.url}`)
    next()
})

app.listen(PORT, (err) => {
    console.log(`App is listening on port ${PORT}`)
})

module.exports = app


