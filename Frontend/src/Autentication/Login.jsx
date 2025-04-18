import { useState } from 'react'
import '../styles.css'

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [name,setName]=useState('')

  const handleSubmit=async()=>{
    const endpoint =isRegister?'/auth/register':'/auth/login';
    const res=await fetch('https://localhost:3000${endpoint}',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      
    })
  };

  return (
    <>
      <div className='flex items-center justify-center h-screen w-screen'>
        <div className='bg-gray-400 p-6 rounded-xl  max-w-md'>
          <p className='pb-2 text-3xl'>{isRegister ? 'Register' : 'Login'}</p>
          <p className='pb-2'>{isRegister ? 'Already have an account?' : "New User?"}{' '}
              <span className='cursor-pointer text-white hover:underline' onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? 'Login' : 'Register'}
              </span>
          </p>
          {isRegister ? <input type="text" className='bg-white w-full p-2 border rounded mb-3' placeholder='Name' value={name} onChange={(e)=>setName(e.target.value)}/> : <></>}
          <input type="email" className='bg-white w-full p-2 border rounded mb-3' placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
          <input type="password" className='bg-white w-full p-2 border rounded mb-3' placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
          <button className='bg-gray-600 w-full p-2 border rounded mb-3'>
            {isRegister ? 'Register' : 'Login'}
          </button>
        </div>

      </div>
    </>
  )
}

export default Login
