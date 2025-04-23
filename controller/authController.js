const userModel = require("../model/userSchema");
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');

const validEmail = emailValidator.validate(email);
if(!validEmail){
    res.status(400).json({
        success:false,
        message:'provide a valid email'})
}

if(password !== confirmPassword){
    res.status(400).json({
        success:false,
        message:"password and confirmPassword doesn't match"})
}

const signup = async (req,res,next)=>{

    const {name, email, password, confirmPassword} = req.body;
    console.log(name, email, password, confirmPassword);

    if(!name||!email||!password||!confirmPassword){
        res.status(400).json({
            success:false,
            message:'every field is required'
        })
    }

    try{
        const userInfo = userModel(req.body);
        const result = await userInfo.save();

        return res.status(200).json({
            success:true,
            data:result
        });

    } catch(e){
        if (e.code === 11000){

            return res.status(400).json({
                success:false,
                message:"accout already exists with given email"
            });
        }
        return res.status(400).json({
            success:false,
            message:e.message
        });
    }
}

const signin = async (req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        res.status(400).json({
            success:false,
            message:"every field is mandatory"})
    }

    try{
        const user = await userModel
        .find({email})
        .select('+password');

    if(!user || !(await bcrypt.compare(password,user.password))) {
        res.status(400).json({
            success:false,
            message:"invalid credentials"})
    }

    const token = user.jwtToken();
    user.password=undefined;

    const cookieOption = {
        maxAge: 24*60*60*1000,
        httpOnly:true
    };

    res.cookie("token", token, cookieOption);
    res.status(200).json({
        success:true,
        data:user
    })
    } catch(e){
        res.status(400).json({
            success:false,
            message:e.message})
    }
}

const getUser = async (req,res,next)=>{
    const userId = req.user.id;
    
    try{
        const user = await userModel.findById(userId);
        return res.status(200).json({
            success:true,
            data:user
        });
    } catch(e){
        res.status(400).json({
            success:false,
            message:e.message
        })
    }
}

const logout = (req,res)=>{
    try{
        const cookieOption = {
            expires: new Date(),
            httpOnly:true
        };
        res.cookie("token", null, cookieOption);
        res.status(200).json({
            success:true,
            message:"Logged Out"
        });
    } catch(e){
        res.status(400).json({
            success:false,
            message:e.message
        });
    }

}

module.exports = {
    signup,
    signin,
    getUser,
    logout
}