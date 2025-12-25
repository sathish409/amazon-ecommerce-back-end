// import Stripe from "stripe";
// // import Sale from "../models/payment/SaleSchema.js";

// // Create payment intent
// export const createPayment = async (req, res) => {
//   try {
//     console.log(req.body);
//     //using sdk to process
//     const secret = process.env.STRIPE_SECRET_KEY;
//     console.log("Stripe key:", process.env.STRIPE_SECRET_KEY);


//     const stripe = new Stripe(secret);
//     const { total, currency, paymentMethodType, cartList, userId } = req.body;
//     const amount = Math.round(total * 100);
//     // 1️⃣ Create PaymentIntent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount, // Stripe works in cents
//       currency,
//       payment_method_types: [paymentMethodType],
//     });
// console.log(paymentIntent.client_secret)
// //    const saleObjects = cartList.map(item => ({
// //   productId: item._id,
// //   userId,
// //   amount: total,       // or item-specific amount if needed
// //   quantity: item.qty,
// //   paymentStatus: "pending",
// //   orderStatus: "processing",
// //   paymentIntentId: paymentIntent.id,
// // }));

// // await Sale.insertMany(saleObjects);

//     // 3️⃣ Return client secret
//     return res.json({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error("Payment error:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// };
// export const handleStripeWebhook  = async (req, res) => {
//   try {
//     const { saleId, paymentStatus } = req.body;
//     const sale = await Sale.findByIdAndUpdate(
//       saleId,
//       { paymentStatus },
//       { new: true }
//     );
//     res.json({ success: true, sale });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
