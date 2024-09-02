import Joi from 'joi'


export const newUserValidation=(req, res, next)=>{
    try {
       const  schema = Joi.object({
      fname: Joi.string().required(),
      lname: Joi.string().required(),
      email: Joi.string().email({minDomainSegments:2}).required(),
      phone: Joi.string().required(),
      password: Joi.string().required(),

       })

       const {error}= schema.validate(req.body);
       if(error){
        return res.json({
          status:"error",
          message:error.message,
        })
       }
       next();
    } catch (error) {
        console.log(error)
    }
}


export const userSignInValidation=(req, res, next)=>{
  try {
     const  schema = Joi.object({
    email: Joi.string().email({minDomainSegments:2}).required(),
    password: Joi.string().required(),

     })

     const {error}= schema.validate(req.body);
     if(error){
      return res.json({
        status:"error",
        message:error.message,
      })
     }
     next();
  } catch (error) {
      console.log(error)
  }
}