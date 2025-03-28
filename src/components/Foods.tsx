import { useEffect, useState } from "react";
import axios from "axios";
import CatFoods from "./CatFoods";

export default function Foods({orderList,setOrderList}){
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


    return(
        <div className="w-[1440px]">
            {catList?.map((el,index) => (
                <div key={index} className="mb-[100px]">
                    <div className="text-[30px] font-bold mb-[60px]" id={el.catName}>{el.catName}</div>
                    <CatFoods category={el.catName} orderList={orderList} setOrderList={setOrderList}/>
                </div>
            ))
            }
        </div>
    )
}