// import React from 'react'

import WebApp from "@twa-dev/sdk";

function Game() {
        WebApp.BackButton.hide();
    
    return (
        <div className='flex items-center justify-center '>
            <div className="text-white text-center font-[600] text-[18px] mt-[50%]">
                Games <br />
                Coming Soon!
            </div>
        </div>
    )
}

export default Game
