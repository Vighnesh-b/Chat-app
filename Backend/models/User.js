const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: {type:String,unique:true},
    password: String,
    refreshToken: {type:String,default:null}
}, { versionKey: false });

module.exports = mongoose.model('User', UserSchema,"User");
