import express from 'express';
import jwt from 'jsonwebtoken';
import { ContentModel, LinkModel, UserModel } from './db';
import { userMiddleware } from './middleware';
import { random } from './utils';
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors())

app.post("/api/v1/signup", async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    try{
    await UserModel.create({
        username: username,
        password: password
    })
    res.json({
        message:"User created successfully"
    })}catch(err){
        res.status(411).json({
            message:"User already exists"
        })
    }
})
app.post("/api/v1/signin", async(req,res)=>{

    const username = req.body.username;
    const password = req.body.password;
    
    const existingUser = await UserModel.findOne({
        username: username,
        password: password
    })
    if(existingUser){
        const token = jwt.sign({
            id: existingUser._id
        },process.env.JWT_SECRET as string,{
            expiresIn: "1h"
        })
        res.json({
            message:"User signed in successfully",
            token
        })
    }else{
        res.status(403).json({
            message:"Invalid credentials"
        })
    }
})


app.post("/api/v1/content", userMiddleware ,async (req,res)=>{
    const link = req.body.link;
    const type = req.body.type;
   await ContentModel.create({
        link,
        type,
        title: req.body.title,
        // @ts-ignore
        userId: req.userId,
        tags:[]
    })
    res.json({
        message:"Content added successfully"
    })
})

app.get("/api/v1/content", userMiddleware, async (req,res)=>{
    // @ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId
    }).populate("userId","username")
    res.json(content)
})

app.delete("/api/v1/content",userMiddleware, async (req,res)=>{
    const contentId = req.body.contentId;
    await ContentModel.deleteMany({
        _id: contentId,
        // @ts-ignore
        userId: req.userId
    })
    res.json({
        message:"Content deleted successfully"
    })
})

app.post("/api/v1/brain/share",userMiddleware, async(req,res)=>{
    const share = req.body.share;
    if(share){
        const existingLink = await LinkModel.findOne({
            // @ts-ignore
            userId: req.userId
        })
        if(existingLink){
            res.status(411).json({
                message:"Link already exists",
                shareLink:"/api/v1/brain/share" + existingLink.hash
            })
            return;
        }
        const hash = random(10);
        await LinkModel.create({
            // @ts-ignore
            userId: req.userId,
            hash: hash
        })
        res.json({
            message:"Link shared successfully",
            shareLink:"/api/v1/brain/share" + hash
        })
    }else{
       await LinkModel.deleteOne({
            // @ts-ignore
            userId: req.userId
        })
        res.json({
            message:"Link deleted successfully"
        })
    }
    
})

app.get("/api/v1/brain/:shareLink", async (req,res)=>{
    const hash = req.params.shareLink;
    const link = await LinkModel.findOne({
        hash
    })
    if(!link){
        res.status(411).json({
            message:"Link not found -_- !"  
        })
        return;
    }

    const content = await ContentModel.findOne({
        userId: link.userId
    })

    const user = await UserModel.findOne({
        _id: link.userId
    })

    res.json({
        username: user?.username,
        content: content
    })
})

app.listen(3000, ()=>{
    console.log("Server started on port 3000")
})