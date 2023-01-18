import React, { useState } from 'react'

function PopUpForm({ popUpHandler, popUp, setPopUp }  : 
  { popUpHandler: () => void, popUp: boolean, setPopUp: (arg0: boolean) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  function handleForm(){
    //send email directly to gmail
    setLoading(true)

  }

  return (
    <div className='fixed top-0 left-0 right-0 text-white w-full h-full
        z-20 backdrop-blur-sm'>
        <div className='absolute top-1/2 left-1/2 w-1/2 -translate-y-1/2 -translate-x-1/2 rounded-lg
        max-w-[50rem] min-w-[35rem] md:min-w-[25rem]'>
          <div className="h-full w-full bg-gradient-to-tr from-sky-500 via-violet-500 rounded-lg to-blue-500 p-1">
            <div className='h-full w-full bg-slate-800 py-10 px-10 rounded-lg'>
              <h1 className='text-3xl font-bold text-center pb-5'>Contact</h1>
              <p className='text-2xl text-center pb-5'>Feel free to get in touch and talk more about your projects.</p>
              <div>
                <form className='flex flex-col' onSubmit={handleForm}>
                  <label htmlFor="name" className='text-lg font-bold pb-1'>Name</label>
                  <input type="text" name="name" id="name" className='border-solid border-2 
                  border-sky-500 rounded-lg text-black p-2'
                  value={name} onChange={(e) => setName(e.target.value)}/>
                  
                  <label htmlFor="email" className='text-lg font-bold pb-1 '>Email</label>
                  <input type="email" name="email" id="email" className='border-solid border-2 
                  border-sky-500 rounded-lg text-black p-2'
                  value={email} onChange={(e) => setEmail(e.target.value)}/>

                  <label htmlFor="message" className='text-lg font-bold pb-1'>Message</label>
                  <textarea name="message" id="message" cols={30} rows={10} className='border-solid border-2 
                  border-sky-500 rounded-lg text-black p-2'
                  value={message} onChange={(e) => setMessage(e.target.value)}/>

                  <button className='p-3 mt-8 border-solid border-2 border-sky-500 rounded-lg'
                  type='submit'>Send</button>
                </form>

                {error && <p>{error}</p>}
                
                {success && <p>{success}</p>}

                {loading && <p>Loading...</p>}
              </div>
              <div className='flex w-full justify-end mt-8'>
                <button className='py-3 border-solid border-2 border-sky-500 rounded-lg
                w-32 text-center'
                onClick={popUpHandler}>Close</button>
              </div>
            </div>
          </div> 
        </div>
      </div>
  )
}

export default PopUpForm