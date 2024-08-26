const express = require("express");
const zod = require("zod");
const { User , Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const router= express.Router();
const {authMiddleware} = require("../middleware")

const signupScehma= zod.object({ 
    username:zod.string().email(),
    password:zod.string() ,
    fistName:zod.string(),
    lastName:zod.string()
});

router.post("/signup", async (req, res)=>{
    const {success} = signupScehma.safeParse(req.body);         // since this return an object so we wrapped {success} 
    if (!success) {                                              //can  also do obj=signup..if(!obj.success)
        return res.status(411).json({
            message:"Incorrect inputs"
        })
    }
    const user= await findOne({
        username: req.body.username 
    })
    if(user._id){
        return res.json({
            message:"Email is already taken"
        })
    }
    const dbUser= await User.create({ 
        username:req.body.username ,
        password:req.body.password ,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
    })
    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random()*10000 
    })
    //if user has reached the server i.e. user is allowed to access the website so create a token
    const token = jwt.sign(userId , JWT_SECRET);

    res.json({
        message:"User created successfully",
        token:  token // first token is keyword
    })
});


router.get("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
    const dbUser = await User.findOne({
        username: req.body.username ,
        password: req.body.password
    });

    if (dbUser) {
        const token = jwt.sign({
            userId: dbUser._id
        }, JWT_SECRET);

        res.json({
            token: token
        })
        return;
    }
        res.status(411).json({
            message: "Error while logging in"
        })
})

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/update", authMiddleware , async (req, res) => {
    const {success} = updateBody.safeParse(req.body)
    if(!success){
        res.status(411).json({
            message: "Error while updating information"
        })
    }
    await User.updateOne({_id:req.userId} ,  req.body);
    res.json({
        message:"Updated successfully"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";      //It means either user's data in serachbox OR empty string i.e print all users

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports={
    router
} 