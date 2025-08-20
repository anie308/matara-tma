// const ClaimButton = ({
//   action,
//   loading,
//   disabled,
//   miningStatus,
// }: {
//   action: () => void;
//   disabled: boolean;
//   loading: boolean,
//   miningStatus: boolean;
// }) => {
//   // Decide button label
//   let buttonLabel = "Start Mining";

//   if (miningStatus) {
//     if (disabled) {
//       buttonLabel = "Mining in progress";
//     } else {
//       buttonLabel = "Claim Mined Matara";
//     }
//   }

//   return (
//     <div className="flex flex-col mt-5 relative items-center justify-center">
//       <img src="/lion.jpg" alt="Majestic Lion" />
//       <div className="grad-con absolute -top-5 flex items-start justify-center w-full p-1">
//         <button
//           disabled={miningStatus && disabled} // Only disable while mining is ongoing
//           onClick={action}
//           className="btn font-black disabled:bg-gray-300 text-lg mt-[-20px] py-3 px-8 rounded-lg"
//         >
//           {loading ? "loading.." : buttonLabel}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ClaimButton;

const ClaimButton = ({
  action,
  start,
  disabled,
  miningStatus,
  loading,
}: {
  action: () => void;
  start: () => void;
  disabled: boolean;
  miningStatus: boolean;
  loading: boolean;
}) => {
  let buttonLabel = "Start Mining";
  let onClickHandler = start;

  if (miningStatus) {
    if (disabled) {
      buttonLabel = "Claim Mined Matara";
      onClickHandler = action;
    } else {
      buttonLabel = "Mining in progress";
      onClickHandler = () => {};
    }
  }

  return (
    <div className="flex flex-col mt-5 relative items-center justify-center">
      <img src="/lion.jpg" alt="Majestic Lion" />
      <div className="grad-con absolute -top-5 flex items-start justify-center w-full p-1">
        <button
          disabled={loading || (miningStatus && !disabled)}
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

