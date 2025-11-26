import Link from 'next/link'
import React from 'react'

function Login() {
  return (
    <div>
        <div>Login to unlock all Farming tools</div>
        <div>
           <label>username :</label>
           <input type='text' placeholder='enter your username'/>
            <label>password :</label>
           <input type='text' placeholder='enter your password'/>
          
        </div>
        <div>
            <button type='button'>Login</button>
        </div>
        <div>
            <span>are you new user?<Link href={'/signup'}>singup</Link></span>
        </div>
    </div>
  )
}

export default Login