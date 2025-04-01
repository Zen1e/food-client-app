import { useEffect, useState } from "react";
import axios from "axios";
import CatFoods from "./CatFoods";

export default function Foods({ orderList, setOrderList }) {
  const [catList, setCatList] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          "https://food-service-app-ciba.onrender.com/cat/"
        );
        setCatList(response.data.cats);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategory();
  }, []);

  return (
    <div className="w-[1440px]">
      {catList?.map((el, index) => (
        <CatFoods
          key={index}
          category={el.catName}
          orderList={orderList}
          setOrderList={setOrderList}
        />
      ))}
    </div>
  );
}
