import reviewSchema from "./reviewSchema.js"



export const createReview =(reviewObj)=>{
    return reviewSchema(reviewObj).save()
}



export const getAllReviews =(filter)=>{
    return reviewSchema.find(filter)
}

export const deleteReview =(filter)=>{
    return reviewSchema.findOneAndDelete(filter)
}