const ClaimButton = ({
  action,
  start,
  miningStatus,
  loading,
  canClaim,
}: {
  action: () => void;
  start: () => void;
  miningStatus: boolean;
  loading: boolean;
  canClaim: boolean;
}) => {
  let buttonLabel = "Start Mining";
  let onClickHandler = start;
  let isDisabled = loading;

  if (miningStatus) {
    // ⛏️ Mining session is active
    buttonLabel = "Mining in progress";
    onClickHandler = () => {};
    isDisabled = true;
  } else if (canClaim) {
    // ✅ Mining ended, rewards are ready
    buttonLabel = "Claim Mined Matara";
    onClickHandler = action;
    isDisabled = loading; // only disable if claim is processing
  }

  return (
    <div className="flex flex-col mt-5 relative items-center justify-center">
      <img src="/8.jpg" className="h-[300px] w-full object-cover object-top" alt="Majestic Lion" />
      <div className="grad-con absolute -top-5 flex items-start justify-center w-full p-1">
        <button
          disabled={isDisabled}
          onClick={onClickHandler}
          className="btn font-black disabled:bg-gray-300 text-lg mt-[-20px] py-3 px-8 rounded-lg"
        >
          {loading ? "Please wait..." : buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default ClaimButton;
