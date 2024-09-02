
import jwt from 'jsonwebtoken'
import {  createSession } from "../models/session/SessionModel.js";
import { updateRefreshJWT } from "../models/users/UserModel.js";



export const signAccessJWT = (obj)=>{
    const token = jwt.sign(obj, process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: "15m",
        })
        createSession({token})
        return token;
}
export const decodedAccessJWT = (accessJWT)=>{
    return jwt.verify(accessJWT, process.env.JWT_ACCESS_SECRET)
         
}
export const decodedRefreshJWT = (refreshJWT)=>{
    return jwt.verify(refreshJWT, process.env.JWT_REFRESH_SECRET)
         
}



export const signRefreshJWT=(email)=>{
    const token = jwt.sign({email}, process.env.JWT_REFRESH_SECRET ,
        {
            expiresIn:"30d",
        } )
        updateRefreshJWT(email, token)

    return token;
}


export const signJWTs =(email)=>{
    return {
        accessJWT: signAccessJWT({email}),
        refreshJWT: signRefreshJWT(email)
    }

}