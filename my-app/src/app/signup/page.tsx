import React from 'react'
import Link from 'next/link'
function Singup() {
  return (
    <div>
        <div>create your account </div>
        <div>
           <label></label>
           <input type='text' placeholder='enter your username'/>
            <label></label>
           <input type='password' placeholder='enter your password'/>
          
        </div>
        <div >
            <button type='button'>Login</button>
        </div>
      
    </div>
  )
}

export default Singup