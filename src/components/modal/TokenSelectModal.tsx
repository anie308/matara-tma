/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { GoPlus } from "react-icons/go";

type TokenSelectModalProps = {
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  onSelectToken: (token: string) => void;
};

const tokens = [
    { name: 'TON', icon: '/lion.jpg' },
    { name: 'BTC', icon: '/scout.jpg' },
    { name: 'USDT', icon: '/8.jpg' },
];

function TokenSelectModal({ setIsOpen, isOpen, onSelectToken }: TokenSelectModalProps) {
  function close() {
    setIsOpen(false);
  }

  function handleSelectToken(token: string) {
    onSelectToken(token);
    close();
  }

  return (
    <>
      <Transition appear show={isOpen}>
        <Dialog
          as="div"
          className="relative z-10 focus:outline-none"
          onClose={close}
          __demoMode
        >
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/50">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 transform-[scale(95%)]"
                enterTo="opacity-100 transform-[scale(100%)]"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 transform-[scale(100%)]"
                leaveTo="opacity-0 transform-[scale(95%)]"
              >
                <DialogPanel className="w-full max-w-md rounded-[15px] bg-[#131721] p-[20px_20px] ">
                  <div className="w-full items-center justify-between flex mb-[20px]">
                    <h2 className="text-white font-inter font-[600] text-[20px]">Select a token</h2>
                    <button
                      className="flex items-center justify-center"
                      onClick={close}
                    >
                      <GoPlus className="text-white rotate-45 text-[40px]" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {tokens.map((token) => (
                        <button
                            key={token.name}
                            onClick={() => handleSelectToken(token.name)}
                            className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-700"
                        >
                            <img src={token.icon} alt={token.name} className="w-8 h-8"/>
                            <span className="text-white font-inter font-[500] text-[18px]">{token.name}</span>
                        </button>
                    ))}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default TokenSelectModal;
