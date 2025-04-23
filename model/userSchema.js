const mongoose = require('mongoose');
const { Schema } = mongoose;
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    name:{
        type:String,
        require:[true, 'username is required'],
        minLength:[6, 'name must be atleast 6 char'],
        maxLength:[15, 'name must be less than 15 char'],
        trim:true
    },
    email:{
        type:String,
        require:[true, 'email is required'],
        unique:[true,'already registered'],
        lowercase:true
    },
    password:{
        type:String,
        select:false
    },
    forgotPasswordToken:{
        type:String,
    },
    forgotPasswordExpiryDate:{
        type: Date
    }
}, {
    timestamps:true
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    return next();
})

userSchema.methods = {
    jwtToken(){
        return JWT.sign(
            {id:this._id, email:this.email},
            process.env.SECRET,
            {expiresIn:'24h'})
    }
}

const userModel = mongoose.model('user', userSchema);
module.exports=userModel;