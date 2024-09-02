import express from 'express';

import "dotenv/config"
import cors from 'cors'
import morgan from 'morgan'
import userRouter from './src/user-router/userRouter.js'
import productRouter from './src/product-router/productRouter.js'
import categoriesRouter from './src/categories-router/categoriesRouter.js'
//mongodb connect
import {connectDb} from './src/config/mongoDb.js'

connectDb()

const app = express()

const PORT = process.env.PORT || 8000;



app.use(express.json())
app.use(cors())
app.use(morgan("dev"))


app.use("/api/v1/users", userRouter)
app.use("/api/v1/products", productRouter)
app.use("/api/v1/categories", categoriesRouter
)



app.get("/", (req, res)=>{
    res.json({
        status:"success",
        message:"from get"
    })
})
app.use("*", (req, res, next)=>{
    const error ={
        message: "404 page not found",
        errorCode: 404,
    }
})

app.use((error, req, res, next) =>{
    const errorCode= error.errorCode || 500;
    res.status(errorCode).json({
        status:"error",
        message:error.message,
    })

})
app.listen(PORT, (error)=>{
    error?
    console.log(error.message)
    :
    console.log(`server is running at http://localhost:${PORT}`)
})
