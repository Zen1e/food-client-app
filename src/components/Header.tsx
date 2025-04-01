"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";

export default function Header(props) {
  const { id, name, setOrdermenu } = props;
  const [profileDrop, setProfileDrop] = useState(false);
  const [locMenu, setLocMenu] = useState(false);
  const [locText, setLocText] = useState("");
  const [dbLocation, setdbLocation] = useState("");
  const router = useRouter();


  useEffect(() => {
    const res = localStorage.getItem("authToken");
    if (!res) {
      router.push("login");
    }
  }, []);


  useEffect(()=> {
    const findUser = async() => {
      const response = await axios.post("https://food-service-app-ciba.onrender.com/users/find",{
        id: id
      },
      { headers: { Authorization: `Bearer ${window.localStorage.authToken}` } })
      setdbLocation(response.data.location);
      setLocText(response.data.location);
    }
    findUser();
  },[])

  
  useEffect(() => {
    if (locMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [locMenu]);

  const signout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleLoc = (e) => {
    setLocText(e.target.value);
  };

  const submitLocation = async () => {
    try{
      await axios.put("https://food-service-app-ciba.onrender.com/users/", {
      id: id,
      location: locText,
    },
    { headers: { Authorization: `Bearer ${window.localStorage.authToken}` } });
    
      setLocMenu(false);
      setdbLocation(locText);
    } catch(err) {
      console.log(err);
      
      toast.error("Couldn't set the location");
    }
  };

  return (
    <div className="w-screen px-[88px] py-[12px] bg-black h-[68px]">
      {locMenu && (
        <div className="w-screen h-screen bg-black/25 fixed top-0 left-0 z-10 flex justify-center items-center text-black">
          <ToastContainer position="top-center"/>
          <div className="w-[500px] h-[300px] bg-white rounded-[12px] p-[30px]">
            <div className="flex w-full justify-between">
              <div className="text-[24px] font-bold">Delivery address</div>
              <img
                src="./x.svg"
                className="w-[38px] h-[38px] p-[8px] bg-gray-100 rounded-full"
                onClick={() => setLocMenu(false)}
              />
            </div>
            <textarea
              className="resize-none border outline-none w-full h-[100px] mt-[30px] rounded-[10px] p-[10px]"
              placeholder="Please provide specific address details such as building number, entrance, and apartment number"
              value={locText}
              onChange={handleLoc}
            ></textarea>
            <div className="w-full flex mt-[30px] gap-[15px] justify-end">
              <button
                className="w-fit h-fit px-[15px] py-[10px] border rounded-[8px]"
                onClick={() => setLocMenu(false)}
              >
                Cancel
              </button>
              <button
                className="w-fit h-fit px-[15px] py-[10px] border rounded-[8px] bg-black text-white"
                onClick={submitLocation}
              >
                Deliver here
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="h-[44px] flex justify-between">
        <div className="flex gap-[15px]">
          <img src="./logo.svg" alt="" />
          <div>
            <div className="font-bold text-[20px]">
              <span className="text-white">Nom</span>
              <span className="text-red-500">Nom</span>
            </div>
            <div className="text-white text-[12px] mt-[-5px]">
              Swift delivery
            </div>
          </div>
        </div>
        <div className="flex items-center gap-[15px]">
          <div className="rounded-full h-[90%] w-[250px] bg-white text-black px-[10px] flex items-center overflow-hidden">
            <div
              className="flex gap-[5px] items-center cursor-pointer"
              onClick={() => setLocMenu(true)}
            >
              <img src="location.svg" alt="" />
              <div className="text-[14px] text-red-500 min-w-fit">
                Delivery address:
              </div>
              {dbLocation ? (
                <div className="text-nowrap">{dbLocation}</div>
              ) : (
                <div className="text-[14px] text-gray-500">Add location</div>
              )}
            </div>
          </div>
          <button
            className="p-[11px] rounded-full bg-white"
            onClick={() => setOrdermenu(true)}
          >
            <img src="./shopping-cart.svg" alt="" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="p-[11px] rounded-full bg-red-500 outline-none hover:bg-red-400 transition duration-[.1s]">
              <img
                src="./user.svg"
                alt=""
                onClick={() => setProfileDrop(!profileDrop)}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[188px] h-[104px] p-[16px] border absolute ml-[-100px] mt-[20px] bg-white rounded-[5px] flex flex-col items-center">
              <div>{name}</div>
              <div
                className="border mt-[10px] w-fit px-[5px] rounded-[5px]"
                onClick={signout}
              >
                Sign out
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
