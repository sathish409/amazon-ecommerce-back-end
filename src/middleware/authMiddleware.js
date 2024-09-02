import { decode } from "jsonwebtoken";
import { getSession } from "../models/session/SessionModel.js"
import { getOneUser, getUserByemail } from "../models/users/UserModel.js"
import { decodedAccessJWT, decodedRefreshJWT, signAccessJWT } from "./jwtHelper.js"



export const userAuth =async(req, res, next)=>{
try {
    const {authorization} = req.headers;

    //validate if accessJWT is valid
    const decoded= decodedAccessJWT(authorization)

    if(decoded?.email){
        const tokenExist =await getSession({ token:authorization })

        if(tokenExist?._id){
            const user = await getUserByemail(decoded.email)
            if(user?._id){
              user.password= undefined
              req.userInfo= user;
              return next()
            }
        }
    }
    console.log(user)
    throw new Error("Invalid token, Unauthorized")
    
} catch (error) {
    error.errorCode = 401;
    if(error.message.includes("jwt expired")){
        error.errorCode = 403
    }
}
    

}

export const refreshAuth =async(req, res, next)=>{

     try {
         const {authorization} = req.headers

         const decoded = decodedRefreshJWT(authorization)

         if(decoded?.email){
           const user = await getOneUser({email:decoded.email, refreshJWT: authorization})
           if(user?._id){
            const accessJWT = await signAccessJWT({email:user.email})
       
            return res.json({
                status:"success",
                accessJWT,
            })
           }
         }
         throw new Error("invalid token, unauthorized")


     } catch (error) {
        error.errorCode =401;
        if(error.message.includes("jwt expired")){
            error.errorCode =403
        }
        next(error)
     }
}