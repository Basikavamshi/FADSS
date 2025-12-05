'use client'
import React, {  useEffect } from 'react'
import { useState } from 'react'
import { X } from 'lucide-react';
import axios from 'axios'
import { Menu } from 'lucide-react';
import { Search } from 'lucide-react';
import { CircleChevronRight } from 'lucide-react';
import Image from 'next/image';
import logo from '../../../public/Group.svg'
import { SquarePen } from 'lucide-react';
import { NotebookText } from 'lucide-react';
import { FolderOpen } from 'lucide-react';
import { EllipsisVertical } from 'lucide-react';

import Link from 'next/link';
import { MdFmdBad } from 'react-icons/md';
function ChatLayout({children}) {
  const [session,setsessions]=useState([])
  const [menuStatus,setmenuStatus]=useState(true)
  const [toggleMenuStatus,setToggleMenuStatus]=useState(false)
  const HandleMenu=()=>{
     //  let element=document.getElementById("menupage")
      if(menuStatus){
        /* element.style.width="fit-content"
        element.style.paddingTop="0em"
        element.style.padding="0.5em" */
        setmenuStatus(false)
      }
      else{ 
        /* element.style.width="100%"
        element.style.paddingTop="0em"
        element.style.padding="0.5em" */
        setmenuStatus(true)

      }
  }
  const toggleMenu=()=>{
   /*  let element=document.getElementById("menupage") */
    if(toggleMenuStatus){
      /* element.style.width="0"
      element.style.padding="0" */
      setToggleMenuStatus(false)
    }
    else{
      /* element.style.width="100%"
      element.style.padding="0.5em" */
      setToggleMenuStatus(true)
    }
  } 
  useEffect(() => {
     axios.get("http://127.0.0.1:8000/chat_history/",{headers:{authorization:`Bearer ${localStorage.getItem("access_token")}`}})
       .then(response => {
           setsessions(response.data.sessions)
       })
       .catch(error => {
         console.error('Error fetching chat history:', error);
       });
   }, [])

   
  return (
  
    <div className='flex flex-row   h-screen w-full bg-[black] max-w-full  min-h-screen min-w-screen overflow-hidden '>

        {/* menu  */}
        <div className={`  absolute lg:gap-y-2 lg:static z-1 bg-[#434141B8]   ${toggleMenuStatus?"w-[100%] p-2 ":"w-0 p-0"}  ${menuStatus?"lg:w-[100%] lg:p-2 lg:pt-0":"lg:w-[fit-content] lg:p-2 lg:pt-0 "} grid  overflow-hidden grid-cols-1 grid-rows-[max-content_auto]  h-[100%]    pt-0  p-0 box-border sm2:max-w-[250px] justify-center justify-items-center `} id='menupage'>
            <div className={`grid ${menuStatus?"lg:grid-cols-2 lg:grid-rows-1 justify-between":"lg:grid-rows-2 lg:grid-cols-1 justify-center justify-items-center"} grid-cols-2 grid-rows-1 h-[100%] w-[100%] lg:gap-y-4 content-top items-top box-border pt-3  `}>
                <button className={`lg:${menuStatus?'grid':'grid lg:order-2'}  justify-self-start   text-[1em] font-bold`}><Search className=' size-5 sm2:size-6'/></button>
                <button className={`hidden lg:grid grid-cols-1 grid-rows-1 lg:${menuStatus?"justify-self-end justify-items-end":"justify-self-center justify-center"}    lg:text-[1em] font-bold`} onClick={HandleMenu}><CircleChevronRight className='size-6'/></button> 
                <button className={`grid lg:hidden grid-cols-1 grid-rows-1 justify-self-end  justify-items-center  text-xl font-bold`} onClick={toggleMenu}><X className='size-5 sm2:size-6 '/></button> 

            </div>
            <div className='grid grid-cols-1 grid-flow-row h-[100%] w-[100%] content-start items-start gap-5 pt-4 box-border '>
              <div className='grid grid-cols-1 grid-rows-[auto_auto_auto] h-[100%] w-[100%] content-center items-center gap-6'>
                <button className={`grid ${menuStatus?"lg:grid-cols-[auto_auto] lg:justify-start":"lg:grid-cols-[auto] lg:justify-center lg:justify-items-center"} grid-cols-[auto_auto] grid-rows-1 justify-start justify-self-start  font-bold h-[100%] w-[100%]  justify-items-start content-center gap-2.5 text-[0.9em] sm2:text-[1em]`}><SquarePen className=' size-5 sm2:size-6' /><span className={`lg:${menuStatus?'grid':'hidden'} grid`}  >New chat</span></button>
                <button className={`grid ${menuStatus?"lg:grid-cols-[auto_auto] lg:justify-start":"lg:grid-cols-[auto] lg:justify-center lg:justify-items-center"} grid-cols-[auto_auto] grid-rows-1 justify-start justify-self-start  font-bold h-[100%] w-[100%]  justify-items-start content-center gap-2.5 text-[0.9em] sm2:text-[1em]`}><NotebookText className='size-5 sm2:size-6' /><span className={`lg:${menuStatus?'grid':'hidden'} grid`} >Summarize</span></button>
                <button className={`grid ${menuStatus?"lg:grid-cols-[auto_auto] lg:justify-start":"lg:grid-cols-[auto] lg:justify-center lg:justify-items-center"} grid-cols-[auto_auto] grid-rows-1 justify-start justify-self-start  font-bold h-[100%] w-[100%]  justify-items-start content-center gap-2.5 text-[0.9em]  sm2:text-[1em]`}><FolderOpen className='size-5 sm2:size-6' /><span className={`lg:${menuStatus?'grid':'hidden'} grid`} >Media</span></button>
              </div>
              <div className='grid grid-cols-1 grid-flow-row h-[100%] w-[100%] content-center items-center gap-4  box-border'>
                <span className={` ${menuStatus?"lg:grid":"lg:hidden"}  text-[0.9em] text-[gray]`}>recent chats</span>
                <div className='grid grid-cols-1 grid-flow-row h-[100%] w-[100%] content-center items-center gap-5'>
                 {
                  session.map((sess)=>{
                    return (
                         <Link  key={sess.id} href={`/chat/${sess.id}`}   className={`group ${menuStatus?"grid":"hidden"} hover:bg-[#6867676f]  grid-cols-[0.9fr_0.1fr] grid-rows-[100%] justify-self-start  font-bold h-[100%] w-[100%] justify-start justify-items-start content-center items-center gap-2.5 text-[1em]  rounded-[5px] p-1 pl-2 box-border`}  id='chatbtn'>
                            <span className='text-[0.9em] font-medium text-nowrap sm2:text-[1em]'>{sess.session_name}</span><EllipsisVertical className='hidden group-hover:block size-3.5 justify-self-end ' id='menubtn'/>
                         </Link>
                     
                    )
                  })
                  }

                </div>
                  

              </div>
            </div>
        </div>

        {/** chat area */}
        <div className='grid grid-cols-[1fr] grid-rows-[50px_auto] h-full w-full max-w-full '>

           {/** header area */}
            <div className='grid  grid-flow-col gap-x-2 grid-rows-1 h-[100%] w-[100%]  max-h-[100%] max-w-[100%] justify-start content-top items-top pl-2 pt-3 box-border  border-b-[gray] border-b-[2px] '> 
                <div className='grid lg:hidden grid-cols-1 grid-rows-1 w-[100%] h-[100%]  content-top justify-center'>
                  <button onClick={toggleMenu} className=' grid  text-[1em]  h-[100%] content-center'><Menu className='size-5'/></button>
                </div>
                <div className='h-[100%] w-[fit-content] max-h-[100%] max-w-[100%]  lg:content-start lg:items-start content-center items-center box-border '>
                  <Image src={logo} alt='logo'   className=' inline object-contain min-w-[53px] w-[5em]  aspect-square h-4   box-border z-100 md:w-[80px] md:h-5 '></Image>
               </div>
            </div>

            {/** messages area */}
            <div className=' grid grid-cols-[1fr] grid-rows-[1fr] h-[100%] w-[100%] justify-items-center content-center items-center max-w-[100%] max-h-[100%]  p-4  pt-0 box-border overflow-hidden '>
                {children}
            </div>

        </div>
    </div>
  )
}

export default ChatLayout

