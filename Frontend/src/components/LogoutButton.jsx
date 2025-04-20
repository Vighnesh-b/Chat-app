import {useNavigate} from 'react-router-dom';
import axios from '../axios';
function LogoutButton(){
    const navigate= useNavigate();

    const handleLogout = async()=>{
        const refreshToken = localStorage.getItem('refreshToken');
        try{
            await axios.post('/auth/logout',{
                refreshToken: refreshToken
            });
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            alert('Logged out');
            navigate('/Login');
        }catch(err){
            console.error('Logout failed:',err);
        }
    };
    return (
        <button onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
            Logout
        </button>
    );
}

export default LogoutButton;