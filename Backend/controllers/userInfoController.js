const UserInfo=require('../models/UserInfo')

exports.userinfo=async(req,res)=>{
    try{
    const {userId}=req.body;
    if(!userId){
        return res.status(400).json({error:'UserId is missing'});
    }
    const userInformation=await UserInfo.findById(userId);
    if(!userInformation){
        return res.status(400).json({error:'UserId not found'});
    }
    res.status(200).json({message:'UserInformation',userInformation});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};