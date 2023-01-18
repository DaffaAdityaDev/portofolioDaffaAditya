import React, { useState } from 'react'
import PopUpForm from './PopUpForm'

const Contact = () => {
  const [popUp, setPopUp] = useState(false)

  function popUpHandler() {
    setPopUp(!popUp)
  }
  // console.log(popUp)

  return(
    <div className='flex flex-col justify-center items-center h-screen'>
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
      <button className='p-3 mt-8 border-solid border-2 border-sky-500 rounded-lg'
      onClick={popUpHandler}>Say Hello</button>
    </div>
  )
}

export default Contact