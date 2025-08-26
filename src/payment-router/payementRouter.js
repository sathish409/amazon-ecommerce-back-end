import express from 'express'
const router = express.Router()

import Stripe from 'stripe'




router.post("/create-payment", async(req, res)=>{
try {
    console.log(req.body)
    //using sdk to process
    const secret = "sk_test_51Q2NqPRqmABuaXCPwFxgelV97EUneJQjx0bIglweedLBfIN7EtcDKgVgTWyn8acMqTauQHwozftCtntwzy5E0PVk00PVhAZQAQ"

    const stripe =new Stripe(secret)
    const {total ,currency, paymentMethodType} =req.body

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total * 100,
        currency,
        payment_method_types:[paymentMethodType],
     
      
    })
    console.log(paymentIntent)
    //return secret key
     res.json({
        clientSecret:paymentIntent.client_secret,
    })
} catch (error) {

}

    
})



export default router;