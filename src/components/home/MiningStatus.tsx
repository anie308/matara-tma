import { useState } from 'react';

const MiningStatus = () => {
  const [porfolioStatus, setPortfolioStatus] = useState(false);

  return (
    <div className="flex flex-col items-center py-8">
      <div className="flex items-center justify-center space-x-5">
        <div>
          <p className="text-green-400 text-xs">Mining Mode</p>
          <p className="font-black text-2xl text-white leading-tight">
            2.023 <br />
            $MAT
          </p>
        </div>
        <div>
          {porfolioStatus ? (
            <img src="/earn-up.svg" alt="Earning up" />
          ) : (
            <img
              src="/earn-down.svg"
              onClick={() => setPortfolioStatus(true)}
              alt="Earning down"
            />
          )}
        </div>
        <div>
          <p className="text-yellow-400 text-xs">Earning Rate</p>
          <p className="font-black text-2xl text-white leading-tight">0.0002</p>
          <p className="text-white font-semibold text-sm">$MAT/Sec</p>
        </div>
      </div>
      <p className="mt-4 text-white">
        <span className="text-yellow-500">Mining Resets</span> in 23hrs:23mins
      </p>
    </div>
  );
};

export default MiningStatus;
