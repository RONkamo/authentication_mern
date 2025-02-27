import { sendPasswordResetEmail, sendResetSuccessEmail, sendverificationEmail, sendWelcomeEmail } from '../mailtrap/emails.js';
import { User } from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto'
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';


export const  signup = async(req, res) => {
    const {email,password,name} = req.body;

    try {
        if(!email || !password || !name){
            throw new Error("All fields are required")

        }

        const userAlreadyExists = await User.findOne({ email });
        if(userAlreadyExists){
            return res.status(400).json({success: false, message:"User Already Exits"});
        }

       const hashedPassword = await bcryptjs.hash(password,10);
       const verificationToken = Math.floor(100000 + Math.random()*900000).toString();

       const user = new User({
        email,
        password: hashedPassword,
        name,
        verificationToken,
        verificationExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours

       });

       await user.save();
       console.log("User Created:", user);  // Log the saved user object


       //jwt
       generateTokenAndSetCookie(res,user._id);

       await sendverificationEmail(user.email,verificationToken);

       res.status(201).json({ 
        success: true, 
        message: "User registered successfully",
        user:{
            ...user._doc,
            password: null,
        }
    });


    } catch (error) {
        res.status(400).json({success: false, message: error.message});
        
    }
};
export const verifyEmail = async (req,res) => {
    const {code} = req.body;

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationExpiresAt: {$gt: Date.now()}
        });

        if(!user){
            return req.status(400).json({
                success:false,message: "Invaild or expired verification code"
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpiresAt = undefined;

        await user.save();

        await sendWelcomeEmail(user.email,user.name);
        res.status(200).json({success:true,message: "Email Verified Successfully",
            user:{
                ...user._doc,
                password: undefined,
            }
        })
        
    } catch (error) {
        console.log("error in verifyEmail ",error);
        res.status(500).json({success:false,message: "Server Error"})
        
    }

};

export const  login = async(req, res) => {
    const {email,password} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user){
            res.status(404).json({success: false, message:"Invaild credentials"});
        }

        const isPasswordVaild = await bcryptjs.compare(password,user.password);
        if(!isPasswordVaild){
            res.status(404).json({success: false, message:"Invaild credentials"});
        }

        generateTokenAndSetCookie(res,user._id);

        user.lastlogin = new Date();
        await user.save();


        res.status(200).json({
            success: true,
            message:"Logged in Successfully",
            user:{
                ...user._doc,
                password:undefined,
            }
        })
        

    } catch (error) {
        console.log("erroe in Login ",error);
        res.status(400).json({success:false,message:error.message});
    }
};

export const  logout = async(req, res) => {
    res.clearCookie("token");
    res.status(200).json({success: true,message : "Logged out Successfully"});
};

export const forgotPassword = async(req, res) => {
    const {email} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({success: false,message:"User not found"})
        }

        //Generate rest Token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpireAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpireAt;

        await user.save();

        //send email
        await sendPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({success: true,message:"Password reset link send to your email"})

    } catch (error) {
        console.log(`Error in forgot password`,error);
        res.status(400).json({success: false, message: error.message});
        
    }
};

export const resetPassword = async(req,res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;


        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt:{$gt: Date.now()}
        });

        if(!user){
            return res.status(400).json({success: false,message:"Invaild or expired reset token"});
        }

        //update password

        const hashedPassword =await bcryptjs.hash(password,10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt=undefined;

        await user.save();

        await sendResetSuccessEmail (user.email)

        res.status(200).json({success: true, message: "Password Reset Successful"})

        
    } catch (error) {
        console.log(`Error in Reset password`,error);
        res.status(400).json({success: false, message: error.message});
        
    }

}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if(!user){
            return res.status(400).json({success: false, message:"User not found"})
        }

        res.status(200).json({ success : true,user})
    } catch (error) {
        console.log("Error in checkAuth",error)
        res.status(400).json({success: false, message: error.message});
        
    }
}
