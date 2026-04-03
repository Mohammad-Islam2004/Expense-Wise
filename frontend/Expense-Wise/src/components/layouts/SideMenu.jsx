import { useContext } from 'react'
import { SIDE_MENU_DATA } from '../../utils/data'
import { UserContext } from '../../context/UserContext'
import { useNavigate } from "react-router-dom"
import CharAvatar from '../cards/CharAvatar'

const SideMenu = ({activeMenu}) => {
  const { user, clearUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleClick = (item) => {
  // Use the label or a specific 'action' key to identify logout
  if (item.path === "logout" || item.label === "Logout") {
    handleLogout();
    return; // CRITICAL: Stop the function here so navigate() is never called
  }
  
  navigate(item.path);
};

  const handleLogout = () => {
    localStorage.clear()
    clearUser()
    navigate("/login")
  }

  return (
    <div className='w-64 h-[calc(100vh-61px)] bg-gray-100 border-r border-r-gray-200/50 p-5 sticky top-15.25 z-20'>
      <div className="flex flex-col items-center justify-center mt-3 mb-7">
        {user?.profileUserUrl ? (
          <img
            src={user?.profileUserUrl || ""}
            alt='profile image'
            className='w-20 h-20 rounded-full bg-slate-400'
          />
        ) : (
          <CharAvatar
            fullName={user?.fullName}
            width="w-20"
            height="h-20"
            style="text-3xl bg-primary"
          />
        )
        }

        <h5 className='text-gray-950 font-medium leading-6'> {user?.fullName || ""} </h5>
      </div>

      {SIDE_MENU_DATA.map((item, index) => (
  <button
    key={`menu_${index}`}
    className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 transition-all
      ${activeMenu === item.label ? "text-white bg-primary" : "text-gray-600 hover:bg-gray-100"} 
      ${item.path === "logout" ? "mt-10 border-t pt-5 rounded-none" : ""} 
    `}
    onClick={() => handleClick(item)}
  >
    <item.icon className='text-xl' />
    {item.label}
  </button>
))}
    </div>
  )
}

export default SideMenu