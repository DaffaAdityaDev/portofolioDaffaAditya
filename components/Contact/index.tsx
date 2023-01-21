import React, { useState } from 'react'
import PopUpForm from './PopUpForm'

const Contact = () => {
  const [popUp, setPopUp] = useState(false)

  function popUpHandler() {
    setPopUp(!popUp)
  }
  // console.log(popUp)

  return(
    <div className='flex flex-col justify-center items-center h-screen antialiased'>
      {popUp && <div>
        <div className="z-10 fixed top-0 left-0 right-0 w-full 
        h-full bg-sky-800opacity-10"/>
        <PopUpForm 
        popUp={popUp}
        setPopUp={setPopUp}
        popUpHandler={popUpHandler}/>
      </div>}
      <h1 className='text-2xl font-bold '>Contact</h1>
      <p>Feel free to get in touch and talk more about your projects.</p>
      <button className='p-3 mt-8 border-solid border-2 border-sky-500 rounded-lg 
      hover:scale-110 ease-out duration-300 transition hover:font-bold 
      hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r from-green-400 to-emerald-500'
      onClick={popUpHandler}>Say Hello</button>
    </div>
  )
}

export default Contact