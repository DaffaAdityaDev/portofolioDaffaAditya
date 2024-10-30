import React, { useState } from 'react';

const Contact = () => {
  const [popUp, setPopUp] = useState(false);

  function popUpHandler() {
    setPopUp(!popUp);
  }
  // console.log(popUp)

  return (
    <div className="flex h-screen flex-col items-center justify-center antialiased">
      {popUp && (
        <div>
          <div
            className="bg-sky-800opacity-10 fixed left-0 right-0 top-0 z-10 
        h-full w-full"
          />
          
        </div>
      )}
      <h1 className="text-2xl font-bold ">Contact</h1>
      <p>Feel free to get in touch and talk more about your projects.</p>
      <button
        className="mt-8 rounded-lg border-2 border-solid border-sky-500 from-green-400 
      to-emerald-500 p-3 transition duration-300 ease-out 
      hover:scale-110 hover:bg-gradient-to-r hover:bg-clip-text hover:font-bold hover:text-transparent"
        onClick={popUpHandler}
      >
        Say Hello
      </button>
    </div>
  );
};

export default Contact;
