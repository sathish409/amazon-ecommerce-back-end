import express from "express";

import {
  createProduct,
  findAProduct,
  getAProduct,
  getProducts,
} from "../models/product/ProductModel.js";
import slugify from "slugify";
import { userAuth } from "../middleware/authMiddleware.js";
import { getQuaryCategories } from "../models/category/CategoryModel.js";

import { getOneUser } from "../models/users/UserModel.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { productname, ...rest } = req.body;
    const obj = {
      productname,

      ...rest,
      slug: slugify(productname, {
        lower: true,
        trim: true,
      }),
    };
    const product = await createProduct(obj);
    console.log(req.body);

    if (product?._id) {
      return res.json({
        status: "success",
        message: "Product has been created successfully",
      });
    }
    res.json({
      status: "error",
      message: "Unable to create product",
    });

    console.log(error.message);
  } catch (error) {
    if (
      error.message.includes(
        "E11000 duplicate key error collection: amazon.products index: sku_1 dup key"
      )
    ) {
      error.message = "Product with same sku already exist";
      error.errorCode = 200;
    }
    next(error);
  }
});

router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;

    const products = _id ? await getAProduct({ _id }) : await getProducts();
    res.json({
      status: "success",
      message: "Here are the products",
      products,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/search-products/:query", async (req, res, next) => {
  try {
    const { query } = req.params;
    console.log(query);
    ///get category list using query
    const categoryList = await getQuaryCategories({
      slug: { $regex: query, $options: "i" },
    });
    console.log(categoryList);

    // if catid exist using parent catid get all products

    if (categoryList.length > 0) {
      const categoryIds = categoryList.map((category) => category._id);
      const list = await getProducts({ parentCatId: { $in: categoryIds } });
      res.json({
        status: "success",
        message: "here are the searched products",
        list,
      });

      console.log(list);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/reduce-quantity", async (req, res, next) => {
  console.log(req.body);
  const { cartList, _id } = req.body;

  try {
    const userExist = await getOneUser({ _id });
    if (!userExist) {
      return res.json({
        message: "user not found",
      });
    }
    const purchaseHistory = await Promise.all(
      cartList.map(async (product) => {
        const { _id, productquantity, productname } = product;
        console.log(product);
        const existingProduct = await findAProduct(_id);
        console.log(existingProduct);
        if (!existingProduct) {
          throw new error(`Product with ID ${_id} not found`);
        }
        if (existingProduct.quantity < productquantity) {
          throw new error(
            `Insufficient stock for ${existingProduct.productname} not found`
          );
        }
        //reduce quantity

        existingProduct.quantity -= productquantity;
        await existingProduct.save();
        return {
          productName: existingProduct.productname,
          productId: existingProduct._id,
          quantity: productquantity,
          purchaseDate: new Date(),
        };
      })
    );
    userExist.purchaseHistory.push(...purchaseHistory);
    await userExist.save();

    res.json({
      status: "success",
      message: "Purchase completed successfully",
      ...purchaseHistory,
    });
  } catch (error) {
    res.json({
      message: "Error during purchase",
      error: error.message,
    });
  }
});
export default router;
