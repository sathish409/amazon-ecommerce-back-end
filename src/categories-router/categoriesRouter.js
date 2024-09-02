import express from 'express'

import slugify from 'slugify'
import { createCategory, getCategories } from '../models/category/CategoryModel.js'
import { userAuth } from '../middleware/authMiddleware.js'

const router = express.Router()


router.post("/", async(req, res, next)=>{
    try {
        const {title} = req.body
        console.log(title)
        const obj ={
            title,
            slug:slugify(title, {
                lower:true,
                trim:true,
            })
        }

        const category = await createCategory(obj);
        console.log(category)

        if(category?._id){
          return res.json({
                status: "success",
                message:"Category has been created successfully",
            })
        
        }
        res.json({
            status: "error",
            message:"Unable to create user",
        })

       console.log(error.message) 
     

    } catch (error) {
      if(error.message.includes("E11000 duplicate key error collection")){
        error.message = "category with the same name already exist, please use other name"
        error.errorCode = 200
      }
      next(error)
    }
})

router.get("/",async (req, res, next)=>{

try {

    const categories = await getCategories()
     res.json({
        status:"success",
        message:"Here are the categories",
        categories,
    })
    
} catch (error) {
    next(error)
}
})


export default router;