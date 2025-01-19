import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

export const userMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header as string,process.env.JWT_SECRET as string);
    if(decoded){
        // @ts-ignore
        req.userId = decoded.id
        next()
    }else{
        res.status(403).json({
            message:"Please Login first !" 
        })
    }
}