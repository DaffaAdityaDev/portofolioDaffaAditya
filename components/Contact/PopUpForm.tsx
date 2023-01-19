import React, { useState, useRef, Ref } from 'react'
import emailjs from '@emailjs/browser';
import { eventNames } from 'process';
import spiner from '../../public/svg/spinner.svg'
import spinerOneThird from '../../public/svg/spinner-one-third.svg'
import confirm from '../../public/svg/confirm.svg'
import alert from '../../public/svg/alert.svg'
import Image from 'next/image'

function PopUpForm({ popUpHandler, popUp, setPopUp }  : 
  { popUpHandler: () => void, popUp: boolean, setPopUp: (arg0: boolean) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useRef<any>(null);

  // console.log(form.current.name.value)

  function handleForm(event: any){
    setLoading(false)
    setError(false)
    setSuccess(false)
    //send email directly to gmail
    event.preventDefault()
    setLoading(true)
    emailjs.sendForm('service_xxxhn0b', 'template_mgesihk', form.current, '43UknkSlJ7aFi3pFD')
      .then((result) => {
        setSuccess(true)
        setLoading(false)
      }, (error) => {
        setLoading(false)
        setError(true)
      });
    
    event.target.reset()
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
                <form className='flex flex-col mb-4' ref={form} onSubmit={event => handleForm(event)}>
                  <label htmlFor="name" className='text-lg font-bold pb-1'>Name</label>
                  <input type="text" name="name" id="name" className='border-solid border-2 
                  border-sky-500 rounded-lg text-black p-2' required
                  value={name} onChange={(e) => setName(e.target.value)}/>
                  
                  <label htmlFor="email" className='text-lg font-bold pb-1 '>Email</label>
                  <input type="email" name="email" id="email" className='border-solid border-2 
                  border-sky-500 rounded-lg text-black p-2' required
                  value={email} onChange={(e) => setEmail(e.target.value)}/>

                  <label htmlFor="message" className='text-lg font-bold pb-1'>Message</label>
                  <textarea name="message" id="message" cols={30} rows={10} className='border-solid border-2 
                  border-sky-500 rounded-lg text-black p-2' required
                  value={message} onChange={(e) => setMessage(e.target.value)}/>

                  {loading ? <button className='p-3 mt-8 border-solid border-2 border-sky-500 rounded-lg
                    disabled animate-pulse cursor-wait'
                    type='submit' disabled>Send</button> : <button className='p-3 mt-8 border-solid 
                    border-2 border-sky-500 rounded-lg'
                  type='submit'>Send</button>}
                </form>
                <div className='w-full h-15 flex justify-center'>
                  {error && <div className='flex items-center'>
                    <Image src={alert} width={30} height={30} alt='svg' className='animate-pulse' />
                    <p className='text-center ml-1'>Failed Send</p>
                  </div>}
                  
                  {success &&<div className='flex items-center'>
                    <Image src={confirm} width={30} height={30} alt='svg' className='' />
                    <p className='text-center ml-1'>Sent</p>
                  </div>}

                  {loading && <div className='flex items-center'>
                    <Image src={spinerOneThird} width={50} height={50} alt='svg' className='animate-spin' />
                    <p className='text-center ml-1'>Sending Message</p>
                  </div>}
                </div>
              </div>
              <div className='flex w-full justify-end'>
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