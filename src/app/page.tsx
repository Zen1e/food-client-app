"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {

      const token = localStorage.getItem("authToken");
      
      if (token) {
        router.push("/home");
      } else {
        router.push("/login");
      }
  }, [router]);

  return(
    <div className="flex justify-center items-center h-screen bg-black text-white flex-col gap-[30px]">
        <img src="./logo.svg" className="w-[100px] h-[100px]"/>
        <div className="text-[25px] font-thin">Loading...</div>
    </div>
)

}