
import { getSession } from "../models/session/SessionModel.js"
import { getOneUser, getUserByemail } from "../models/users/UserModel.js"
import { decodedAccessJWT, decodedRefreshJWT, signAccessJWT } from "./jwtHelper.js"



export const userAuth = async(req, res, next)=>{
try {
     console.log("userAuth running — Authorization header:", req.headers.authorization);
    const {authorization} = req.headers;
    if (!authorization) {
      const err = new Error("Authorization header missing");
      err.errorCode = 401;
      return next(err);
    }


    //validate if accessJWT is valid
    const decoded= decodedAccessJWT(authorization)
if (!decoded?.email) {
      const err = new Error("Invalid token payload");
      err.errorCode = 401;
      return next(err);
    }
    
          const tokenExist =await getSession({ 
            token:authorization,})
    if (!tokenExist?._id) {
      const err = new Error("Session not found");
      err.errorCode = 401;
      return next(err);
    }

         const user = await getUserByemail(decoded.email)
             if (!user?._id) {
      const err = new Error("User not found");
      err.errorCode = 401;
      return next(err);
    }
           
              user.password= undefined
              req.userInfo= user;
                  console.log("after userAuth:", req.userInfo);
              return next()
            
    

 
  
    
} catch (error) {
    error.errorCode = 401;
    if(error.message.includes("jwt expired")){
        error.errorCode = 401
    }
    return next(error)
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