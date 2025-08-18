const ClaimButton = () => {
  return (
    <div className="flex flex-col mt-5 relative items-center justify-center">
      <img src="/lion.jpg" alt="Majestic Lion" />
      <div className="grad-con absolute -top-5 flex items-start justify-center w-full p-1">
        <button className="btn font-black text-lg mt-[-20px] py-3 px-8 rounded-lg">
          Claim Matara Daily
        </button>
      </div>
    </div>
  );
};

export default ClaimButton;
