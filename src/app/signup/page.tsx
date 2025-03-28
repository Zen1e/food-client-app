"use client";

import Link from "next/link";
import axios from "axios";
import { SetStateAction, useEffect, useState } from "react";

export default function signup() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);

  useEffect(()=> {
    localStorage.clear();
  },[])


    const handleInput =(e:{ target: { value: SetStateAction<string> , name: string}})=>{
      setLoginData({ ...loginData, [e?.target?.name]: e.target.value})
    }

    const checkEmail = async () => {
      if (!/^\S+@\S+\.\S+$/.test(loginData.email)) {
          setEmailError(true);
          return;
      }
  
      try {
          const isDuplicate = await checkDuplicate();
          if (!isDuplicate) {
              setStep(2);
          } else {
            setEmailError(false);
            setDuplicateError(true);
          }
      } catch (error) {
          console.error("Error checking email:", error);
          setEmailError(true);
      }
  };

    const checkDuplicate = async () => {
      const response = await axios.post("http://localhost:3001/users/check",{
        name: loginData.email,
      })
      return response.data.exists;
    }

    const checkPassword = () => {
        if(loginData.password.length < 8){
            setPasswordError(true);
        }else if(loginData.password !== loginData.confirmPassword){
            setConfirmError(true);
        }else{
            sendData();
            setStep(3);
        }
    }

    const sendData = async() => {
      try{
          const response = await axios.post("http://localhost:3001/users/",{
          name: loginData.email,
          password: loginData.password,
        });
        console.log(response,"saved");
      }catch(err){
        console.log(err);
      }
    }
    
    

  return (
    <div className="flex flex-row w-screen h-screen items-center bg-white">
      {step === 1 ? (
        <div className="h-screen w-1/2 flex justify-center items-center">
          <div className="flex flex-col w-[400px]">
            <div className="font-bold text-[30px]">Create your account</div>
            <div className="text-gray-600">
              Sign up to explore your favorite dishes.
            </div>
            <input
              type="text"
              name="email"
              className="mt-[30px] border border-gray-500 rounded-[5px] px-[10px] py-[5px] outline-none text-[17px]"
              placeholder="Enter your email address"
              onChange={handleInput}
              style={{ border: `1px solid ${emailError || duplicateError ? "red" : "gray"}` }}
              value={loginData.email}
            />
            {duplicateError &&
            <div className="text-red-500 text-[14px]">Email already in use</div>
            }
            {emailError &&
            <div className="text-red-500 text-[14px]">Invalid Email</div>
            }
            <button
              className="bg-black text-white rounded-[5px] py-[8px] mt-[30px]"
              onClick={checkEmail}
            >
              Let's go
            </button>
            <div className="flex gap-[15px] mt-[30px] w-full justify-center">
              <div>Already have an account?</div>
              <Link href={`./login`} className="text-blue-400">
                Log in
              </Link>
            </div>
          </div>
        </div>
      ) : step === 2 ? (
        <div className="h-screen w-1/2 flex justify-center items-center">
          <div className="flex flex-col w-[400px]">
            <button className="border border-gray-500 w-[30px] h-[30px] rounded-[5px]" onClick={() => {setStep(1)}}><img src="./chevron-left.svg" alt="" className="w-[20px] h-[20px] pl-[5px]"/></button>
            <div className="font-bold text-[30px] mt-[20px]">Create a strong password</div>
            <div className="text-gray-600">
              Sign up to explore your favorite dishes.
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className={"mt-[30px] border border-gray-500 rounded-[5px] px-[10px] py-[5px] outline-none text-[17px]"}
              placeholder="Password"
              onChange={handleInput}
              style={{ border: `1px solid ${passwordError ? "red" : "gray"}` }}
              value={loginData.password}
            />
            {passwordError &&
            <div className="text-red-500 text-[14px]">Use at least 8 character</div>
            }
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              className="mt-[20px] border border-gray-500 rounded-[5px] px-[10px] py-[5px] outline-none text-[17px]"
              placeholder="Confirm"
              onChange={handleInput}
              style={{ border: `1px solid ${confirmError ? "red" : "gray"}` }}
              value={loginData.confirmPassword}
            />
            {confirmError &&
            <div className="text-red-500 text-[14px]">Password doesn't match</div>
            }
            <div className="flex flex-row mt-[15px] gap-[10px] w-fit" onClick={()=>setShowPassword(!showPassword)}>
                <input type="checkbox" checked={showPassword} onChange={()=>{}}/>
                <div className="text-gray-500 text-[15px]">Show password</div>
            </div>
            <button
              className="bg-black text-white rounded-[5px] py-[8px] mt-[30px]"
              onClick={checkPassword}
            >
              Let's go
            </button>
            <div className="flex gap-[15px] mt-[30px] w-full justify-center">
              <div>Already have an account?</div>
              <Link href={`./login`} className="text-blue-400">
                Log in
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen w-1/2 flex justify-center items-center">
        <div className="flex flex-col w-[400px]">
          <div className="font-bold text-[30px]">Profile created</div>
          <div className="text-gray-600">
            Log in to enjoy your favorite dishes.
          </div>
          <div className="flex gap-[15px] mt-[30px] w-full">
            <div className="text-[18px] font-bold"><span>Go to </span><Link href={`./login`} className="text-blue-400">Log in</Link><span> page</span></div>
          </div>
        </div>
      </div>
      )}
      <div className="mr-[3vw]">
        <img src="./home_pic.png" alt="" />
      </div>
    </div>
  );
}
