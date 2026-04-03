import { useState } from 'react'
import { HiOutlineMenu, HiOutlineX} from 'react-icons/hi'
import SideMenu from './SideMenu'
import { FaHandHoldingUsd } from "react-icons/fa";
import LOGO from "../../assets/images/logo.png"
const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false)
  return (
    <div className='flex gap-5 bg-white border border-b border-gray-200 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30'>
      <button
      className='block lg:hidden text-black'
      onClick={() => {setOpenSideMenu(!openSideMenu)}}
      >
        {openSideMenu ? (
          <HiOutlineX className='text-2xl' />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      <h2 className='text-3xl font-medium text-black flex gap-2'> <img
          src={LOGO}
          className="w-12"
        /> Expense Wise</h2>

      {openSideMenu && (
        <div className="fixed top-15.25 -ml-4 bg-white">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  )
}

export default Navbar