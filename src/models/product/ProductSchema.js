
import mongoose from 'mongoose'

const productSchema= new mongoose.Schema({
    status:{
        type: String,
        default:"active",
       },
       slug:{
        type: String,
        unique: true,
        index:1,
        required:true,
       },
       sku:{
        type: String,
        unique: true,
        index:1,
        required:true,
       },
     
       thumbnail:{
        type:String,
        required:true,
       },
       productname:{
        type: String,
        required:true,
       },
       producttype:{
        type: String,
     required:true,
       },
 
   sellername:{
    type: String,
  default:""
   },
   parentCatId:{
    type: String,
default:"",
   },
   quantity:{
    type: Number,
    required:true,
   },
   price:{
    type: Number,
    required:true,
   },

   onsale:{
    type: Boolean,
    default:null,
   },
   discount:{
    type: Number,
    default:"",
   },
   trending:{
    type: Boolean,
    default:null,

},
description:{
type:String,
required:true,
},
lastdate:{
  type:Date,
  default:"",
}
},
{
    timestamps:true,
}
)

export default mongoose.model("Product", productSchema)