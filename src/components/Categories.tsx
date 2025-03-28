"use client";

import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import axios from "axios";

export default function Categories() {
  const [catList, setCatList] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get("http://localhost:3001/cat/");
        setCatList(response.data.cats);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategory();
  }, []);

  return (
    <div className="w-[1440px] h-fit">
      <div className="font-bold text-[30px] my-[38px]">Categories</div>
      <div className="flex mb-[80px] gap-[9px] w-full overflow-x-auto whitespace-nowrap">
        {catList &&
          catList.map((el, index) => (
            <a className="w-fit" href={`#${el.catName}`} key={index}><Badge className="text-[18px] max-h-[40px] mb-[10px] w-fit rounded-full px-[20px] py-[5px] bg-white text-black hover:bg-gray-400">{el.catName}</Badge></a>
          ))}
      </div>
    </div>
  );
}
