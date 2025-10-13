import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import WebApp from '@twa-dev/sdk';

import { Menu as MenuIcon, CircleHelp, CircleUserRound, Files } from 'lucide-react'
import { FaRankingStar } from "react-icons/fa6";
import { RiTelegramLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

export default function Example() {
  const navigate = useNavigate()

  return (
    <div>
      <Menu  >
        <MenuButton  className="text-[30px] mt-[5px] outline-none">
        <MenuIcon size={35} className="text-white" />
        </MenuButton>
        <MenuItems
          transition
          anchor="bottom end"
          className="w-52 origin-top-right rounded-xl bg-[#000F15] border-[2px] border-[#02354C] mt-[20px]  p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <MenuItem >
            <button onClick={()=> navigate('/profile')} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
            <CircleUserRound className='text-[#FFC152]'/>
              User Profile
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘E</kbd>
            </button>
          </MenuItem>
          <MenuItem>
            <button onClick={()=> navigate('/matara-ranks')} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
            <FaRankingStar className='text-[#FFC152] text-[23px]'/>
              Matara Rankings
            </button>
          </MenuItem>
          <div className="my-1 h-px bg-white/5" />
          <MenuItem>
            <button onClick={()=> WebApp.openLink('https://drive.google.com/file/d/1HdyuPv6Mmxtvx58GJf3NiYPdfYIsKdsb/view?usp=sharing')} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
            <Files className='text-[#FFC152] text-[14px]' />
             $MARS Whitepaper
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘A</kbd>
            </button>
          </MenuItem>
          <MenuItem>
            <button onClick={()=> WebApp.openLink('https://drive.google.com/file/d/1HdyuPv6Mmxtvx58GJf3NiYPdfYIsKdsb/view?usp=sharing')} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
            <Files className='text-[#FFC152] text-[14px]' />
              Documentation
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘A</kbd>
            </button>
          </MenuItem>
          <MenuItem>
            <button onClick={()=> WebApp.openTelegramLink('http://t.me/MATARA_TOKEN')} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
            <RiTelegramLine className='text-[#FFC152] text-[25px]'/>
              Our TG Channel
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘D</kbd>
            </button>
          </MenuItem>
          <MenuItem>
            <button onClick={()=> WebApp.openTelegramLink('http://t.me/MATARA_TOKEN')} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
            <CircleHelp className='text-[#FFC152] text-[20px]'/>
              Help
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘D</kbd>
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  )
}
