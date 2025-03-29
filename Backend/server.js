const express=require("express")
const app=express()
const dotenv=require("dotenv").config()
const connectDb=require("./config/connectionDb")
const cors=require("cors")
const path = require("path");


const PORT=process.env.PORT || 3000
connectDb()

// --------------------------------Deployment-----------------  


// --------------------------------Deployment-----------------  


app.use(express.json())
app.use(cors());
app.use(express.static("public"))

// Add explicit root route handler
app.get('/', (req, res) => {
  res.json({ message: 'Food Recipe API is running!' });
});

// Add test endpoint for recipe route
app.get('/api-test', (req, res) => {
  res.json({ 
    endpoints: {
      users: '/signUp, /login, /user/:id',
      recipes: '/recipe/, /recipe/:id'
    },
    status: 'online'
  });
});

// Mount user routes - make sure these don't override the root route
app.use("/api", require("./routes/user"))
app.use("/recipe", require("./routes/recipe"))

app.listen(PORT,(err)=>{
    console.log(`app is listening on port ${PORT}`)
})

