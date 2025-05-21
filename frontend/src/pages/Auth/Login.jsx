import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/input/PasswordInput';
import loginIcon from '../../assets/images/Login-amico.png';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    
    setError("");


    //Login API Call
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });


      if(response.data && response.data.accessToken) {
        localStorage.setItem("token" , response.data.accessToken);
        navigate("/dashboard");
      }

    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(err.response.data.message);
      } else {
        setError("Login failed");
      }
      
    }
    
  };


  return (
    <div className="flex items-center  h-screen  overflow-hidden    ">
      <div className="max-w-6xl h-[80vh] mx-auto flex rounded-lg shadow-lg overflow-hidden bg-white/95 backdrop-blur-md">


        {/* Left Panel */}
        <div className=" w-1/2 h-full bg-login-bg-img bg-cover bg-center flex items-end p-10   ">
          <div className=" text-white mr-96">
            <h4 className="text-4xl md:text-6xl font-semibold leading-tight">
              Show.<br /> Share.<br /> Shine.
            </h4>

          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 bg-[#e0dad837] p-10 md:p-16 flex items-center">

          <form className="w-full " onSubmit={handleLogin}>
            <div className="flex justify-center mb-6"> <img src={loginIcon} alt="Logo" className="w-50 h-50" /> </div>
            <h4 className="text-5xl text-center font-semibold mb-2">Login</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={({ target }) => { setEmail(target.value) }}

            />

            <PasswordInput
              value={password}
              onChange={({ target }) => { setPassword(target.value) }}
            />


            {error && <p className='text-red-500 text-xs  pb-1'>{error}</p>}



            <button
              type="submit"
              className="btn-primary">
              Login
            </button>
            <p className="text-center text-xs text-gray-600 my-2 ">OR</p>
            <button
              type="button"
              className="btn-primary btn-light"
              onClick={() => navigate("/signup")}>
              CREATE ACCOUNT
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;
