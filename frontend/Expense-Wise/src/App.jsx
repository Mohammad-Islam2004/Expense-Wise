import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import Login from "../src/pages/Auth/Login"
import SignUp from "../src/pages/Auth/SignUp"
import Home from "../src/pages/Dashboard/Home"
import Income from "../src/pages/Dashboard/Income"
import Expense from "../src/pages/Dashboard/Expense"
import UserProvider from "./context/UserProvider"
import {Toaster} from "react-hot-toast"

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            {/* Public Routes */}
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
            <Route 
            path="/dashboard" 
            element={<ProtectedRoute><Home /></ProtectedRoute>} 
          />
          <Route 
            path="/income" 
            element={<ProtectedRoute><Income /></ProtectedRoute>} 
          />
          <Route 
            path="/expense" 
            element={<ProtectedRoute><Expense /></ProtectedRoute>} 
          />

          {/* Catch-all: Redirect unknown routes to root */}
          <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </div>
      <Toaster
        toastOptions={{
          className:'',
          styles:{
            fontSize: '13px'
          },
        }}
      />
    </UserProvider>
  )
}

// Simple Wrapper for Authentication
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

export default App;
