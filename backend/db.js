const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://admin:AyHkfAphLYmrOnG9@cluster0.hdtsg27.mongodb.net/");

// const cnt = async()=>
//     {
//         try{
//             await mongoose.connect("");
//         }
//         catch(error){
//             console.log("error occured connecting to datatbase." , error.message);
//         }
//     }

const userSchema = new mongoose.Schema({
   username:{
    type:String,
    required: true,
    unique:true,
    trim:true,
    lowercase:true,
    minLength:3,
    maxLength:30
   },
    
    password:{
        type:String,
        required: true,
        minLength: 6,
},
    firstName:{
        type: String,
        required: true,
        trim: true,
        maxLength: 50
},
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
});

const amountSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId, // reference to User Model
        ref:'User', //reference to User table if id dont exist in user table then amount will not be created for that user
        required:true
    },
    balance:{ 
        type:Number,
        required:true
    }
});

const User= mongoose.model('User_table' , userSchema)
const Account = mongoose.model('Account' , amountSchema);

module.exports={
    User,
    Account,
}