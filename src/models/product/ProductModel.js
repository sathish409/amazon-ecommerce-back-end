import ProductSchema from "./ProductSchema.js"


export  const createProduct=(obj)=>{
    return  ProductSchema(obj).save()
}



export  const getProducts=()=>{
    return  ProductSchema.find()
}

export  const getAProduct=({_id})=>{
    return  ProductSchema.findOne({_id})
}



