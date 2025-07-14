import reviewSchema from "./reviewSchema.js"



export const createReview =(reviewObj)=>{
    return reviewSchema(reviewObj).save()
}



export const getReview =(filter)=>{
    return reviewSchema.findOne(filter)
}

export const deleteReview =(filter)=>{
    return reviewSchema.findOneAndDelete(filter)
}