import userSchema from "./UserSchema.js"

export  const createUser=(obj)=>{
    return  userSchema(obj).save()
}
export  const updateUser=(filter, update)=>{
    return  userSchema.findOneAndUpdate(filter, update, {new:true})
}


export  const getUserByemail=(email)=>{
    return  userSchema.findOne({email})
}
export  const getOneUser=(filter)=>{
    return  userSchema.findOne(filter)
}

export  const getUserPasswordById=(_id)=>{
    return  userSchema.findOne(_id, {password: 1})
}

export const updateRefreshJWT=async(email, refreshJWT)=>{
    return await userSchema.findOneAndUpdate({email}, {refreshJWT})
}


