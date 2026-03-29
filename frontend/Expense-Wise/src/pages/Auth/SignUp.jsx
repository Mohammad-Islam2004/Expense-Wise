import { useContext, useState } from "react"
import AuthLayout from "../../components/layouts/AuthLayout"
import { Link, useNavigate } from "react-router-dom"
import Input from "../../components/inputs/Input"
import { validateEmail } from "../../utils/helper"
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import { UserContext } from "../../context/UserContext"
import uploadImage from "../../utils/uploadImage"

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  const { updateUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()
    let profileUserUrl = ""

    if (!fullName) return setError("Please enter your name.")
    if (!validateEmail(email)) return setError("Please enter a valid email address.")
    if (!password) return setError("Please enter the password.")
    
    setError("")

    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic)
        profileUserUrl = imgUploadRes.imageUrl || ""
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileUserUrl,
      })
      
      const { token, user } = response.data

      if (token) {
        localStorage.setItem("token", token)
        updateUser(user)
        navigate("/dashboard")
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError("Something went wrong. Please try again later.")
      }
    }
  }

  return (
    <AuthLayout>
      <div className="lg:w-full h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center px-4 sm:px-0">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-1.25 mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          {/* RESPONSIVE GRID LOGIC:
              - grid-cols-1: Stacks inputs vertically (1 column) on mobile (< 640px).
              - sm:grid-cols-2: Switches to 2 columns on larger screens.
              - gap-3: Tighter spacing for mobile to keep the form visible.
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="Enter your full name"
              type="text"
            />
            
            <Input
              type="text"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="abc@example.com"
            />

            {/* sm:col-span-2 ensures password takes full width only when in 2-column mode */}
            <div className="sm:col-span-2">
              <Input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
                placeholder="Min 8 characters"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs py-2">{error}</p>}

          <button type="submit" className="btn-primary w-full mt-4">
            SIGNUP
          </button>

          <p className="text-[13px] text-slate-800 mt-4 text-center sm:text-left">
            Already have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp