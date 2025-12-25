import express from 'express'
// import { createPayment } from './controller.js';
import Sale from '../models/payment/SaleSchema.js'
import Stripe from "stripe";
const router = express.Router()






router.post("/create-payment", async(req, res)=>{
try {
    console.log(req.body)
    //using sdk to process
    const secret = "sk_test_51Q2NqPRqmABuaXCPwFxgelV97EUneJQjx0bIglweedLBfIN7EtcDKgVgTWyn8acMqTauQHwozftCtntwzy5E0PVk00PVhAZQAQ"

    const stripe =new Stripe(secret)
    const { total ,currency, paymentMethodType} =req.body

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total * 100,
        currency,
        payment_method_types:[paymentMethodType],
     
      
    })
    console.log(paymentIntent)
    console.log(paymentIntent.client_secret)
   
    //return secret key
      res.json({
        clientSecret:paymentIntent.client_secret,
    })
} catch (error) {

}

    
})




router.post("/sale", async(req,res)=>{
    try {
        console.log(req.body)
    const { cartList, userId, paymentIntentId } = req.body;
    if (!cartList || !userId ||  !paymentIntentId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const saleObjects = cartList.map(item => ({
      productId: item._id,
      userId,
      amount:item.price * item.productquantity,// item-specific amount
      quantity: item.productquantity,
      paymentStatus: "succeeded", // since confirmed by client
      orderStatus: "processing",
      paymentIntentId
    }));

    await Sale.insertMany(saleObjects);
    res.status(201).json({ success: true, saved: saleObjects.length });
  } catch (error) {
    console.error("Sale saving error:", error.message);
    res.status(500).json({ error: "Could not save sale" });
  }
 
    
});
router.get("/fetch_data", async(req, res)=>{
    try {
        const salesByDate = await Sale.aggregate([
{
    $group: {
        _id:{$dateToString: {format: "%Y-%m-%d", date:"$createdAt"}},
        totalSales: {$sum:"$amount" }
    }
},
{
    $sort : {_id:1}
}
        ]) 

  const result = salesByDate.map((item)=>({
    date: item._id,
    sales:item.totalSales

  }))
  console.log(result)
  return res.json(result)
    } catch (error) {
        console.error("Error fetching daily sales:", error);
    res.status(500).json({ error: "Server error retrieving sales data" });
    }
})


export default router;