import CategorySchema from "./CategorySchema.js"


export  const createCategory=(obj)=>{
    return  CategorySchema(obj).save()
}


export  const getCategories=()=>{
    return  CategorySchema.find()
}




