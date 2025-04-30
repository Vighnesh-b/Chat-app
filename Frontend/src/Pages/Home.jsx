import {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton'
import MessageWindow from '../Pages/MessageWindow';
import '../styles.css'
function Home(){
    const navigate=useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/Login');
        }
      }, [navigate]);
    return(
        <div className="p-6 bg-black h-screen w-screen">
            <h1 className="text-3xl font-bold text-white">Welcome to home page!</h1>
            <p className="mt-2 text-gray-600">You're logged in 🎉</p>
            <LogoutButton/>
            <MessageWindow></MessageWindow>

        </div>
    )
}
export default Home;