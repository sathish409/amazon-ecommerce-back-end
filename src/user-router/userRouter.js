import express from 'express'
import {  createUser, getOneUser, getUserByemail, getUserPasswordById, updateRefreshJWT, updateUser } from '../models/users/UserModel.js'
import { comparePassword, hashPassword } from '../middleware/bcrypt.js'
import { newUserValidation, userSignInValidation } from '../middleware/joiValidation.js'
import { signJWTs } from '../middleware/jwtHelper.js'
import { refreshAuth, userAuth } from '../middleware/authMiddleware.js'
import { v4 as uuidv4 } from 'uuid';
import { createSession, deleteSession } from '../models/session/SessionModel.js'
import { sendEmailVerificationLinkEmail, sendEmailVerifiedNotificationEmail, sendOtpEmail, sendPasswordChangeEmail } from '../middleware/nodeMailer.js'
import { otpGenerator } from '../middleware/randomOtpGenerator.js'


const router = express.Router()



router.get("/", userAuth, (req, res, next)=>{
    try {
     
      return res.json({
            status: "success",
            message:"Here is the user info",
            user:req.userInfo,
        })
    } catch (error) {
        next(error)
    }
})


router.get("/get-accessjwt", refreshAuth)


router.post("/seller", newUserValidation, async(req, res, next)=>{
    try {
  req.body.password = hashPassword(req.body.password)
        const user = await createUser(req.body);
        console.log(req.body)
        //if user is created , create unique url and emai that to user

        if(user?._id){
        const c= uuidv4()

        const token = await createSession({token:c, associate:user.email})
        if(token?._id){
       const url= `${process.env.CLIENT_ROOT_DOMAIN}/verify-email?e=${user.email}&c=${c}`
       sendEmailVerificationLinkEmail({
        email:user.email, 
        url, 
        fname:user.fname})
        }
 
        }

        if(user?._id){
          return res.json({
                status: "success",
                message:"user has been created successfully",
            })
        
        }
        res.json({
            status: "error",
            message:"Unable to create user",
        })

       console.log(error.message) 
     

    } catch (error) {
        if(error.message.includes("E11000 duplicate key error collection")){
            error.message="The user with the same email already exist, please use another email"
            error.errorCode= 200
        }
        next(error)
    }
})
router.post("/signin", userSignInValidation, async(req, res, next)=>{
    try {

        const {email, password} = req.body 
        //get user by email
        const user = await getUserByemail(email)

 
        if(user?._id){

    

        const isMatched = comparePassword(password, user.password)

        if(isMatched){
                //jwts 

                const jwts = signJWTs(user.email)
                return res.json({
                    status: "success",
                    message:"user signed in successfully",
                    jwts,
                })
        }
        
        }
        res.json({
            status: "error",
            message:"Invalid login details",
        })

  

    } catch (error) {
    
        next(error)
        console.log(error)
    }
})

router.post("/signout", async(req, res, next)=>{
    try {

        const {accessJWT, email} = req.body 
        //delete session from sessionschema using accessjwt
    
            accessJWT && await deleteSession({token:accessJWT})

            //update or empty the refreshJWT from userSchema
            email && await updateRefreshJWT(email, "")
       
      
        res.json({
            status: "success",
            message:"You have been signed out",
        })

  

    } catch (error) {
    
        next(error)
        console.log(error)
    }
})

//verify user email
router.post("/verify-email", async(req, res, next)=>{
    try {
         const {associate, token} = req.body
       if(associate && token){
        //delete form session table
        const session = await deleteSession({associate, token})

        //if success then update the user state to active
        if(session?._id){
            //updte the user to active
            const user = await updateUser({email:associate}, {status:"active"})

            if (user?._id){
                //send email notification
                sendEmailVerifiedNotificationEmail({email:associate, fname:user.fname})
                resp.json({
                    status:"success",
                    message:"your email has been verified, you may login now"
                })
            }
         
        }

       }
       res.json({
        status: "error",
        message:"Invalid link",
    })
    } catch (error) {
        next(error)
    }
})


//otp request

router.post("/request-opt",async(req, res, next)=>{
    try {
        //check user exist in the user table
        const {email}= req.body
        if(email.includes("@")){

            const user =await getOneUser({email})
            if(user?._id){

         //create otp using email
        const otp = otpGenerator()
        //store otp in the session table
        console.log(otp)
        const otpSession = await createSession({
            token: otp,
            associate:email,
        })

        if(otpSession?._id){
    //  send otp email  to user
        sendOtpEmail({
        fname:user.fname,
        email,
        otp
       })
    
     res.json({
        status:"success",
        message:"If your email is found in our system we will send otp to your  email, please check your email"
     })
        }
            }
        }
  

    
   
        
    } catch (error) {
        next(error)
    }
})
// password update

router.patch("/", async(req, res, next)=>{

    try {
        const {password, email, otp} =req.body

        const session = await deleteSession(
          {  token: otp,
           associate: email,
          }
    
        )
        if (session?._id){
          const hashPass  = hashPassword(password)
            const user= await updateUser({email},
                {password:hashPass})
    
                if(user?._id){
                    sendPasswordChangeEmail({
                       fname:user.fname,
                       email,
                   })
                   res.json({
               status:"success",
               message:"your password has been updated"
                   })
                  }       
    
        }
        
    } catch (error) {
        next(error)
    }

   

  
})


router.patch("/password", userAuth, async(req, res, next)=>{

    try {
     const user = req.userInfo;
     const { oldPassword, newPassword } = req.body
     //get password from db using user_id

     const {password} = await getUserPasswordById(user._id)
//comapre oldpassword with db password
     const isMatched = comparePassword(oldPassword, password)

     if(isMatched){

                const newHashPass  = hashPassword(newPassword)
   
        const updatedUser= await updateUser({_id:user._id},
            {password:newHashPass})
            if(updatedUser?._id){
                sendPasswordChangeEmail({
                   fname:user.fname,
                   email:user.email,
               })
              res.json({
           status:"success",
           message:"your password has been changed"
               })
     }

    }
        
    } catch (error) {
        next(error)
    }

   

  
})



export default router;