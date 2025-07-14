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
export const newReviewValidation=(req, res, next)=>{
    try {
       const  schema = Joi.object({
      purchaseId: Joi.string().required(),
      productId: Joi.string().required(),
      userId: Joi.string().required(),
      productName: Joi.string().required(),
      title: Joi.string().required(),
      message: Joi.string().required(),
      num: Joi.number().required(),
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