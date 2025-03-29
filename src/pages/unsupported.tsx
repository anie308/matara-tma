// import React from 'react'

function Unsupported() {
  return (
    <div className="flex min-h-screen root flex-col items-center p-[60px_25px] w-full">
    <div className="w-full lg:w-[40%] flex items-center flex-col">
      <p className="font-inter text-white text-[25px] font-[700] text-center">
        Leave the desktop mobile gaming rocks!
      </p>
      <div className="h-[300px] lg:h-[350px]  w-[80%] flex-col rounded-[10px] mt-[10%] flex items-center justify-center">
        {/* <img src={sun} className="h-[300px]" alt="" /> */}
        <img src="./qrcode_t.me.png" className="h-[300px]" alt="" />
        <a href="https://t.me/@MataraComBot" className="font-inter text-white text-[20px] mt-[2%] font-[700]">@MataraComBot</a>
      </div>
    </div>
  </div>
  )
}

export default Unsupported
