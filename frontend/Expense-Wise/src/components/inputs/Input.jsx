import { useState } from 'react'
import { FaRegEye, FaRegEyeSlash  } from "react-icons/fa";

const Input = ({type, value, label, placeholder, onChange}) => {
  const [showpassword, setShowpassword] = useState(false)

  const toggleShowPassword = () =>{
    setShowpassword(!showpassword)
  }
  return (
    <div>
      <label className='text-[13px] text-slate-800'>{label}</label>
      <div className='input-box'>
        <input className='w-full bg-transparent outline-none'
          type={type =='password' ? showpassword ? 'text' : 'password' : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) =>{onChange(e)}}
        />
        {type =='password' && (
          <>
            {showpassword ? (
              <FaRegEye
                size={22}
                className='text-primary cursor-pointer'
                onClick={()=>{toggleShowPassword()}}
              />
            ) : (
              <FaRegEyeSlash
                size={22}
                className='text-slate-400 cursor-pointer'
                onClick={()=>{toggleShowPassword()}}
              />
            )}
          </>
        )
        }
      </div>
    </div>
  )
}

export default Input