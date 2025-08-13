import express from "express";


import { userAuth } from "../middleware/authMiddleware.js";
import { newReviewValidation } from "../middleware/joiValidation.js";
import { createReview, deleteReviewById, getAllReviews, updateReview } from "../models/review/reviewModal.js";
import { updateProduct } from "../models/product/ProductModel.js";
import { updateUser } from "../models/users/UserModel.js";

const router = express.Router();

router.post("/", userAuth, async (req, res, next) => {
  try {
   
console.log(req.body)

          const user = req.userInfo;
          console.log("userAuth set userInfo:", req.userInfo);
      if (!user?._id) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorised request",
        });
      }
        
    const result = await createReview({ ...req.body, userId: user._id });
 


    if (result?._id) {
       await updateProduct({_id:req.body.productId}, {reviewGiven:result._id})
      await updateUser({_id: user._id,"purchaseHistory._id":req.body.purchaseId}, {$set:{"purchaseHistory.$.reviewSubmitted":result._id}})
      return res.json({
        status: "success",
        message: "Review has been submitted",
      });
    }
  
    res.json({
      status: "error",
      message: "Unable to submit a review",
    });

    console.log(error.message);
  } catch (error) {
   
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {

    const reviews = await getAllReviews() 
    res.json({
      status: "success",
      message: "Here are the reviews",
      reviews,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:_id", userAuth, async (req, res, next) => {
  try {
    const { _id } = req.params;
    const {status} = req.body;
    console.log(_id , status)
    if(["active", "inactive"].includes(status)){
 const result = await updateReview({_id}, {status})
    if (result?._id) {
     
      res.json({
        status: "success",
        message: "The review has been updated",
       
      });
    }
 }
    res.json({
        status: "error",
        message: "Something went wrong please contact administrator",
       
      });
  } catch (error) {
    next(error);
  }
});
router.delete("/:_id", userAuth, async (req, res, next) => {
  try {
    const { _id } = req.params;
    console.log(_id)
     const result = await deleteReviewById({_id})
    if (result?._id) {
     
      res.json({
        status: "success",
        message: "The review has been deleted",
       
      });
 }
    res.json({
        status: "error",
        message: "Something went wrong please contact administrator",
       
      });
  } catch (error) {
    next(error);
  }
});

// router.post("/reduce-quantity", async (req, res, next) => {
//   console.log(req.body);
//   const { cartList, _id } = req.body;

//   try {
//     const userExist = await getOneUser({ _id });
//     if (!userExist) {
//       return res.json({
//         message: "user not found",
//       });
//     }
//     const purchaseHistory = await Promise.all(
//       cartList.map(async (product) => {
//         const { _id, productquantity, productname } = product;
//         console.log(product);
//         const existingProduct = await findAProduct(_id);
//         console.log(existingProduct);
//         if (!existingProduct) {
//           throw new error(`Product with ID ${_id} not found`);
//         }
//         if (existingProduct.quantity < productquantity) {
//           throw new error(
//             `Insufficient stock for ${existingProduct.productname} not found`
//           );
//         }
//         //reduce quantity

//         existingProduct.quantity -= productquantity;
//         await existingProduct.save();
//         return {
//           productName: existingProduct.productname,
//           productId: existingProduct._id,
//           quantity: productquantity,
//           purchaseDate: new Date(),
//         };
//       })
//     );
//     userExist.purchaseHistory.push(...purchaseHistory);
//     await userExist.save();

//     res.json({
//       status: "success",
//       message: "Purchase completed successfully",
//       ...purchaseHistory,
//     });
//   } catch (error) {
//     res.json({
//       message: "Error during purchase",
//       error: error.message,
//     });
//   }
// });
export default router;
