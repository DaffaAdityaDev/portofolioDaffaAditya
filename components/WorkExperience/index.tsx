import React from 'react'

const index = () => {
  return (
    <div className='mt-10'>
        <div className='bg-gradient-to-r mt-20 from-blue-500 to-transparent w-1/6 h-1 rounded-full mb-2'></div>
        <h2 className='text-3xl font-bold mb-5'>Work Experience</h2>
        <div className='flex justify-between'>
            <div>
                <h3 className='text-2xl font-bold'>IT Support</h3>
                <p className='text-1xl font-semibold'>PT Jasa Marga (Persero) Tbk</p>
            </div>
            <div className='flex items-center gap-2'>
                {/* <div className='w-1 h-1 bg-green-500 rounded-full'></div> */}
                <p className='text-2xl font-semibold'>2018</p>
            </div>
        </div>
        <div className='bg-gradient-to-r mt-5 from-sky-400 via-violet-500 to-blue-500 w-full h-1 rounded-full mb-2'></div>
    </div>
  )
}

export default index