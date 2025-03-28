"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Categories from "@/components/Categories";
import Foods from "@/components/Foods";
import Header from "@/components/Header";
import OrderMenu from "@/features/(order_menu)/OrderMenu";
import { decodeJWT } from "../../middleware/decodeJWT.js";

export default function Home() {
    const router = useRouter();

    const [ordermenu, setOrdermenu] = useState(false);
    const [orderList, setOrderList] = useState([]);
    const [userInfo, setUserInfo] = useState<{ id: string; name: string } | null>(null);
    
    
    useEffect(() => {
        const token = typeof window !== 'undefined' 
            ? localStorage.getItem("authToken") 
            : null;

        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const response = decodeJWT(token);
            setUserInfo(response);
            
            response.exp - Math.round(Date.now()/1000) < 0 ? router.push("/login") : "";
        } catch (error) {
            router.push("/login");
        }
    }, [router]);

    useEffect(() => {
        if (ordermenu) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [ordermenu]);

    
    if (!userInfo) {
        return(
            <div className="flex justify-center items-center h-screen bg-black text-white flex-col gap-[30px]">
                <img src="./logo.svg" className="w-[100px] h-[100px]"/>
                <div className="text-[25px] font-thin">Loading...</div>
            </div>
        )
    }

    return (
        <div className="text-white flex flex-col items-center">
            {ordermenu && (
                <OrderMenu 
                    ordermenu={ordermenu} 
                    setOrdermenu={setOrdermenu} 
                    orderList={orderList} 
                    setOrderList={setOrderList} 
                    id={userInfo.id} 
                    name={userInfo.name}
                />
            )}
            <Header 
                id={userInfo.id} 
                name={userInfo.name} 
                setOrdermenu={setOrdermenu}
            />
            <img src="./BG.png" alt="" />
            <Categories />
            <Foods orderList={orderList} setOrderList={setOrderList}/>
        </div>
    );
}