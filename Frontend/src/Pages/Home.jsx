import {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton'
function Home(){
    const navigate=useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/Login');
        }
      }, [navigate]);
    return(
        <div className="p-6">
            <h1 className="text-3xl font-bold">Welcome to home page!</h1>
            <p className="mt-2">You're logged in 🎉</p>
            <LogoutButton/>
        </div>
    )
}
export default Home;