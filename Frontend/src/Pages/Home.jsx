import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import LogoutButton from '../components/LogoutButton';
import MessageWindow from '../Pages/MessageWindow';
import '../styles.css';
import getRandomProfile from '../components/random_img';

function Home() {
  const navigate = useNavigate();
  const [friendList, setFriendList] = useState([]);
  const [receiver,setReceiver]=useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/Login');
    }
  }, [navigate]);

  useEffect(() => {
    const getFriendList = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user.id;
        const res = await axios.get(`/userinfo/${userId}`);
        setFriendList(res.data.userInformation.friendsList);
      } catch (err) {
        console.log(err);
        console.error(err);
      }
    };
    getFriendList();
  }, []);

  return (
    <div className="bg-black h-screen w-screen flex">
      <div className="bg-gray-900 w-1/3 flex flex-col overflow-y-auto h-full space-y-4 p-4">
      <div className="flex justify-between items-center mb-4 mr-2">
    <p className="text-white text-3xl font-bold">SChat</p>
    <LogoutButton />
  </div>
      
        {friendList.length > 0 ? (
          friendList.map((element, idx) => (
            <div key={idx} className="flex items-center space-x-4 p-2 hover:bg-gray-600 rounded-xl cursor-pointer" onClick={()=>setReceiver(element)}>
              <img
                src={getRandomProfile()}
                alt="Friend Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="text-white">{element.friendName}</p>
            </div>
          ))
        ) : (
          <p className="text-white">No friends yet</p>
        )}
      </div>

      <div className="w-2/3 h-full">
        <MessageWindow recipient={receiver}/>
      </div>

      
    </div>
  );
}

export default Home;
