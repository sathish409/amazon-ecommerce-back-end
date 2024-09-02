import sessionSchema from "./SessionSchema.js"



export const createSession =(sessionObj)=>{
    return sessionSchema(sessionObj).save()
}



export const getSession =(filter)=>{
    return sessionSchema.findOne(filter)
}

export const deleteSession =(filter)=>{
    return sessionSchema.findOneAndDelete(filter)
}