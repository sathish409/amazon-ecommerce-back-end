import express from "express";

import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import payementRouter from "./src/payment-router/payementRouter.js";
import userRouter from "./src/user-router/userRouter.js";
import productRouter from "./src/product-router/productRouter.js";
import categoriesRouter from "./src/categories-router/categoriesRouter.js";
import reviewRouter from "./src/review-router/reviewRouter.js";
//mongodb connect
import { connectDb } from "./src/config/mongoDb.js";
import path from "path";
connectDb();

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());


app.use(
  cors({
    origin: [
      "https://amazon-ecommerce-front-1vodwj89p-sathish409s-projects.vercel.app",
      "https://amazon-ecommerce-front-o4cids393-sathish409s-projects.vercel.app",
    ],
    credentials: true,
  })
);

app.use(morgan("dev"));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/payments", payementRouter);
app.use("/api/v1/user-reviews", reviewRouter);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "from get",
  });
});
app.use("*", (req, res, next) => {
  const error = {
    message: "404 page not found",
    errorCode: 404,
  };
});

app.use((error, req, res, next) => {
  const errorCode = error.errorCode || 500;
  res.status(errorCode).json({
    status: "error",
    message: error.message,
  });
});
app.listen(PORT, (error) => {
  error
    ? console.log(error.message)
    : console.log(`server is running at http://localhost:${PORT}`);
});
