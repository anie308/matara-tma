// import React from 'react'

import WebApp from "@twa-dev/sdk";

function Task() {
  WebApp.BackButton.hide();

  return (
    <div className="text-white flex w-full px-[10px] items-center flex-col justify-center">
      <p className="text-[#FFB948] font-[900] text-[35px] mt-[20px]">Social Task</p>
      <p className="text-[15px] text-center text-white font-[500] w-[90%]">Perform Social Tasks to earn more Matara Tokens ($MAT) and grow your rank.</p>



      <div className="w-full mt-[40px]">
        <div className="relative w-full overflow-x-auto">
          <table className="w-full">
            <thead className="text-[14px] text-white border-b border-[#CDCBC8]">
              <tr>
                <th scope="col" className="px-6 py-3 text-start">
                  Task
                </th>
                <th scope="col" className="px-6 py-3 text-start">
                  Earnings
                </th> 
                <th scope="col" className="px-6 py-3 text-start">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="">
                <th scope="row" className="px-6 py-4 text-[14px] font-medium whitespace-nowrap text-start  text-[#CDCBC8]">
                  Share on TikTok
                </th>
                <td className="px-6 py-4 text-start text-[14px] text-[#CDCBC8]">
                  25 $MAT
                </td>
                <td className="px-6 py-4 text-start min-w-[200px]">
                  <button className="btn p-[8px_15px] rounded-[8px] border-[#FFD683] border text-[#000F15] font-[800] text-[12px]">Perform task</button>
                </td>

              </tr>
              <tr className="">
                <th scope="row" className="px-6 py-4 text-[14px] font-medium whitespace-nowrap text-start  text-[#CDCBC8]">
                  Follow FTLD on X
                </th>
                <td className="px-6 py-4 text-start text-[14px] text-[#CDCBC8]">
                  25 $MAT
                </td>
                <td className="px-6 py-4 text-start min-w-[200px]">
                  <button className="btn p-[8px_15px] rounded-[8px] border-[#FFD683] border text-[#000F15] font-[800] text-[12px]">Perform task</button>
                </td>

              </tr>


            </tbody>
          </table>
        </div>
      </div>



    </div>
  )
}

export default Task
