import express from "express";


import { userAuth } from "../middleware/authMiddleware.js";
import { newReviewValidation } from "../middleware/joiValidation.js";
import { createReview, getAllReviews } from "../models/review/reviewModal.js";
import { updateProduct } from "../models/product/ProductModel.js";

const router = express.Router();

router.post("/", userAuth, async (req, res, next) => {
  try {
    console.log("after userAuth:", req.userInfo);
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
 
     console.log("after userAuth:", req.userInfo);

    if (result?._id) {
       await updateProduct({_id:req.body.productId}, {reviewGiven:result._id})
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

// router.get("/search-products/:query", async (req, res, next) => {
//   try {
//     const { query } = req.params;
//     console.log(query);
//     ///get category list using query
//     const categoryList = await getQuaryCategories({
//       slug: { $regex: query, $options: "i" },
//     });
//     console.log(categoryList);

//     // if catid exist using parent catid get all products

//     if (categoryList.length > 0) {
//       const categoryIds = categoryList.map((category) => category._id);
//       const list = await getProducts({ parentCatId: { $in: categoryIds } });
//       res.json({
//         status: "success",
//         message: "here are the searched products",
//         list,
//       });

//       console.log(list);
//     }
//   } catch (error) {
//     next(error);
//   }
// });

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
