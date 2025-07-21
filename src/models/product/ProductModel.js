import ProductSchema from "./ProductSchema.js"


export  const createProduct=(obj)=>{
    return  ProductSchema(obj).save()
}



export  const getProducts=(filter)=>{
    return  ProductSchema.find(filter)
}

export  const getAProduct=({_id})=>{
    return  ProductSchema.findOne({_id})
}

export  const findAProduct=(_id)=>{
    return  ProductSchema.findOne({_id})
}



export  const updateProduct=(filter, update)=>{
    return  ProductSchema.findOneAndUpdate(filter, update)
}



