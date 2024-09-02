import express from 'express'

import { createProduct, getAProduct, getProducts } from '../models/product/ProductModel.js'
import slugify from 'slugify'
import { userAuth } from '../middleware/authMiddleware.js'




const router = express.Router()







router.post("/", async(req, res, next)=>{
    try {
      
    
        const {productname, ...rest} = req.body
        const obj ={
            productname,
           
              ...rest,
            slug:slugify(productname,{
                lower:true,
                trim:true
            })
        }
        const product = await createProduct(obj);
        console.log(req.body)


        if(product?._id){
          return res.json({
                status: "success",
                message:"Product has been created successfully",
            })
        
        }
        res.json({
            status: "error",
            message:"Unable to create product",
        })

       console.log(error.message) 
     

    } catch (error) {
        if(error.message.includes("E11000 duplicate key error collection: amazon.products index: sku_1 dup key"))
            {
               error.message ="Product with same sku already exist"
               error.errorCode =200
             
            }
        next(error)
    }
})

router.get("/:_id?", async (req, res, next)=>{

    try {
        const {_id} = req.params
     
         const products= _id
          ? await  getAProduct({_id})
          : await getProducts()
            res.json({
               status:"success",
               message:"Here are the products",
               products,
           })
        }
    
    
        
    catch (error) {
  
        next(error)
    }
    })

export default router;