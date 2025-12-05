'use client'
import React, { use, useEffect } from 'react'
import { useState } from 'react'
import { Plus } from 'lucide-react';
import axios from 'axios'
import { Send } from 'lucide-react';
import { useRef } from 'react'

function Chatbot({params}) {
  const {id}=use(params)
  const ref=useRef()
  const refh=useRef()
  
  const [chatdata,setchatdata]=useState([
    {question:'',answer:''}
  ])
  const [input ,setinput] = useState('')
  const [sessionid,setsessionid]=useState()
  let socket;
  useEffect(() => {
    
    if(ref.current){
      
      ref.current.style.height = 'auto'; // Reset height to auto to get the correct scrollHeight
      ref.current.style.height = `${ref.current.scrollHeight}px`; // Set height to scrollHeight
    }
    
  }, [input])
  
   useEffect(()=>{
    
    axios.post(`http://127.0.0.1:8000/chat_history/`,{"session_id":Number(id)},{headers:{authorization:`Bearer ${localStorage.getItem("access_token")}`}}).then(
      (response)=>{
          const newChats = response.data.chats.map(chat => ({
          question: chat.message.message,
          answer: chat.message.bot,
        }));
      console.log(newChats)
      setchatdata(newChats);
        
      })
      
   },[sessionid])

   const handlesubmit=()=>{
       setchatdata((prev)=>{
        return [...prev,{question:input,answer:'...'}]
       })
       const currentindex=chatdata.length
       
       
       
        axios.post('http://127.0.0.1:8000/chatbot/', { message: input })
         .then(response => {
           setchatdata((prev)=>{
            const newData=[...prev]
            newData[currentindex]={question:input,answer:response.data.messages}
            return newData
           })
           console.log(response)
         })
         .catch(error => {
           console.error('Error sending message:', error);
         }); 
  }
  const handlekeydown=(e)=>{
    
    if(e.key==='Enter' && !e.shiftKey){
      e.preventDefault(); 
      handlesubmit();
    }
  }

  
  return (
    <div className='relative grid grid-cols-[100%] grid-rows-[100%]  h-[100%] w-[100%] max-h-[100%]  max-w-[700px]  box-border overflow-hidden   '>
   {/* messages area */}                 
            <div className=' grid grid-cols-1  grid-flow-row content-top items-top gap-1 h-[100%] w-[100%] max-h-[100%] max-w-[100%]  box-border overflow-auto hide-scrollbar pb-14 p-3 '>
              {
                chatdata.map((msg, index) =>{
                  if(msg.question=='' && msg.answer==''){
                    return null;
                  }
                  return (
                    <div key={index} className='grid grid-cols-1 pt-2 grid-rows-[auto_auto]  content-start items-start gap-2  max-h-[100%] max-w-[100%] box-border  '>
                        <div className='grid w-[max-content] max-h-[100%] max-w-[100%] h-[max-content] justify-items-end justify-self-end justify-end content-center bg-[#434141B8] rounded-2xl box-border p-2 pt-1 pb-1  ' key={index}>
                          <span className='text-lg text-white'>{msg.question}</span>
                        </div>
                        <div className='grid h-[100%] w-[100%] max-h-[100%] justify-items-start content-center ' key={index}>
                          <span className='text-lg'>{msg.answer}</span>
                        </div>
                    </div>
                  )})
              }      
            </div>
    {/* search bar */}
            <div className='absolute bottom-[0%] grid grid-cols-[auto] grid-rows-[auto] h-fit w-[100%] justify-items-center content-center items-center box-border rounded-md  ' ref={refh}>
              <div className='grid grid-cols-[auto] grid-rows-auto justify-items-center items-center content-center  w-[100%] h-fit box-border relative rounded-md  '>
                  <textarea onKeyDown={handlekeydown} ref={ref} type="text" placeholder='Type your message here...' className='relative border border-gray-300 rounded-md p-1  pl-[15%] pr-[15%] sm2:pl-[8%] sm2:pr-[8%] h-11 sm2:text-[1em] text-[0.7em] w-[100%] text-wrap break-words overflow-hidden resize-none text-start  content-center items-center bg-[black]' onChange={(e) => setinput(e.target.value)} value={input}/>
                  <button onClick={handlesubmit} className='absolute grid h-10  border-amber-100 text-white bg-transparent items-center border-0 right-[2%] bottom-1.7 text-[0.7em]'><Send className='size-5'/></button>
                  <button className='absolute grid h-10  border-amber-100 text-white bg-transparent items-center border-0 left-[2%] bottom-1.7 text-[0.7em] '><Plus className='size-5'/></button>
              </div>
            </div>
     </div>
  )
}

export default Chatbot