
import mongoose from 'mongoose'

const userSchema= new mongoose.Schema({
    status:{
        type: String,
        default:"inActive",
       },
       role:{
        type: String,
       default:"seller",
       },
   fname:{
    type: String,
    required:true,
   },
   lname:{
    type: String,
    required:true,
   },
   email:{
    type: String,
    unique: true,
    index:1,
    required:true,
   },
   phone:{
    type: String,
    required:true,
   },
   password:{
    type: String,
    required:true,
   },
   refreshJWT:{
    type: String,
    default:"",
   },

},
{
    timestamps:true,
})

export default mongoose.model("User", userSchema)