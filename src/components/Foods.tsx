import { useEffect, useState } from "react";
import axios from "axios";
import CatFoods from "./CatFoods";
import {toast, ToastContainer} from "react-toastify";

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

  const pushSuccess = () => {
    toast.success("Added to cart");
  }

  return (
    <div className="w-[1440px]">
      <ToastContainer />
      {catList?.map((el, index) => (
        <CatFoods
          key={index}
          category={el.catName}
          orderList={orderList}
          setOrderList={setOrderList}
          pushSuccess={pushSuccess}
        />
      ))}
    </div>
  );
}
