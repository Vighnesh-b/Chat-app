const UserInfo=require('../models/UserInfo')
const User=require('../models/User')
const mongoose=require('mongoose')
const Message=require('../models/Message')


exports.getUsername = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'UserId is missing' });
    }

    const userInformation = await User.findById(userId);

    if (!userInformation) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Username', username: userInformation.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.userinfo=async(req,res)=>{
    try{
    const {userId}=req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
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
        res.status(500).json({ error: 'Server error',res});
    }
};

exports.sendFriendRequest = async (req, res) => {
    try {
      const { senderId, receiverId } = req.body;
      if (!senderId || !receiverId) {
        return res.status(400).json({ error: 'Fields are missing' });
      }
  
      const sender = await UserInfo.findById(senderId);
      const receiver = await UserInfo.findById(receiverId);
  
      if (!sender || !receiver) {
        return res.status(404).json({ error: 'Sender or receiver not found' });
      }
  
      if (senderId === receiverId) {
        return res.status(400).json({ error: 'Cannot send friend request to yourself' });
      }
  
      const alreadyFriends = sender.friendsList.some(friend => friend.friendId.toString() === receiverId);
      if (alreadyFriends) {
        return res.status(400).json({ error: 'Already friends' });
      }
  
      const alreadyRequested = sender.outgoingFriendRequests.some(req => req.Id.toString() === receiverId);
      const alreadyReceived = sender.incomingFriendRequests.some(req => req.Id.toString() === receiverId);
  
      if (alreadyRequested || alreadyReceived) {
        return res.status(400).json({ error: 'Friend request already exists' });
      }
  
      sender.outgoingFriendRequests.push({ Id: receiver._id, Name: receiver.name });
      receiver.incomingFriendRequests.push({ Id: sender._id, Name: sender.name });
  
      await sender.save();
      await receiver.save();
  
      res.status(200).json({ message: 'Friend request sent' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  exports.acceptFriendRequest = async (req, res) => {
    try {
      const { senderId, receiverId } = req.body;
      if (!senderId || !receiverId) return res.status(400).json({ error: 'Fields are missing' });
  
      const sender = await UserInfo.findById(senderId);
      const receiver = await UserInfo.findById(receiverId);
      if (!sender || !receiver) return res.status(404).json({ error: 'User not found' });
  
      sender.friendsList.push({ friendId: receiver._id, friendName: receiver.name });
      receiver.friendsList.push({ friendId: sender._id, friendName: sender.name });
  
      sender.outgoingFriendRequests = sender.outgoingFriendRequests.filter(req => req.Id.toString() !== receiverId);
      receiver.incomingFriendRequests = receiver.incomingFriendRequests.filter(req => req.Id.toString() !== senderId);
  
      await sender.save();
      await receiver.save();
  
      res.status(200).json({ message: 'Friend request accepted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  exports.rejectFriendRequest = async (req, res) => {
    try {
      const { senderId, receiverId } = req.body;
  
      if (!senderId || !receiverId) {
        return res.status(400).json({ error: 'Missing senderId or receiverId' });
      }
  
      const sender = await UserInfo.findById(senderId);
      const receiver = await UserInfo.findById(receiverId);
  
      if (!sender) {
        return res.status(404).json({ error: 'Sender not found' });
      }
  
      if (!receiver) {
        return res.status(404).json({ error: 'Receiver not found' });
      }
  
      receiver.incomingFriendRequests = receiver.incomingFriendRequests.filter(
        req => String(req.Id) !== String(senderId)
      );
  
      sender.outgoingFriendRequests = sender.outgoingFriendRequests.filter(
        req => String(req.Id) !== String(receiverId)
      );
  
      await sender.save();
      await receiver.save();
  
      res.status(200).json({ message: 'Friend request rejected successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  exports.getMessages = async (req, res) => {
    try {
      console.log(req.body);
      const { senderId, receiverId } = req.body;
  
      if (!senderId || !receiverId) {
        return res.status(400).json({ error: 'UserId is missing' });
      }
  
      const userMessages = await Message.findOne({
        $or: [
          { user1: senderId, user2: receiverId },
          { user1: receiverId, user2: senderId }
        ]
      });
  
      if (!userMessages) {
        return res.status(404).json({ error: 'No messages found between these users' });
      }
  
      res.status(200).json({ messages: userMessages.messages });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  
  