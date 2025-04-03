import { useEffect, useState } from "react";
import axios from "axios";

export default function CatFoods(props) {
  const { category, orderList, setOrderList, pushSuccess } = props;

  const [foods, setFoods] = useState([]);
  const [addToCard, setAddToCard] = useState(false);
  const [currAdding, setCurrAdding] = useState({
    image: "",
    foodName: "",
    ingredients: "",
    price: 0,
  });
  const [currAddingCount, setCurrAddingCount] = useState(1);

  useEffect(() => {
    const fetchFoods = async () => {
      const res = await axios.get(
        `https://food-service-app-ciba.onrender.com/food/${category}`,
        {
          headers: { Authorization: `Bearer ${window.localStorage.authToken}` },
        }
      );
      setFoods(res.data.foods);
    };
    fetchFoods();
  }, []);

  useEffect(() => {
    if (addToCard) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [addToCard]);

  const handlePlus = (el) => {
    setAddToCard(true);
    setCurrAdding(el);
    setCurrAddingCount(1);
  };

  const addFoodToCard = () => {

    pushSuccess();

    const exists = orderList.some((el) => el[0] === currAdding);

    if (exists) {
      const newList = orderList.map((el) => {
        if (el[0] === currAdding) {
          return [el[0], el[1] + currAddingCount];
        } else {
          return [el[0], el[1]];
        }
      });
      setOrderList(newList);
    } else {
      setOrderList([...orderList, [currAdding, currAddingCount]]);
    }
    setAddToCard(false);
  };

  return foods.length === 0 ? (
    ""
  ) : (
    <div className="mb-[100px]">
      <div className="text-[30px] font-bold mb-[60px]" id={category}>
        {category}
      </div>
      <div className="flex flex-wrap gap-x-[120px] gap-y-[80px]">
        {addToCard && (
          <div className="text-black bg-black/30 z-10 fixed w-screen h-screen top-0 left-0 flex justify-center items-center">
            <div className="w-[800px] h-[400px] bg-white rounded-[10px] flex p-[20px] justify-between">
              <div className="w-[48.5%] h-full border rounded-[8px] overflow-hidden">
                <img
                  src={currAdding.image}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col w-[48.5%] h-full">
                <div className="w-full flex justify-end">
                  <div
                    className="p-[7px] border rounded-full cursor-pointer"
                    onClick={() => setAddToCard(false)}
                  >
                    <img src="./x.svg" className="w-[25px] h-[25px]" />
                  </div>
                </div>
                <div className="text-red-500 text-[28px] font-bold leading-0">
                  {currAdding.foodName}
                </div>
                <div className="w-full h-full mt-[20px]">
                  {currAdding.ingredients}
                </div>
                <div className="flex flex-col gap-[20px]">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-[20px]">Total price</div>
                      <div className="font-bold text-[26px]">
                        ${(currAddingCount * currAdding?.price).toFixed(2)}
                      </div>
                    </div>
                    <div className="flex gap-[24px]">
                      <div
                        className="border rounded-full w-[50px] h-[50px] text-[30px] pt-[-50px] pl-[17px] hover:border-black cursor-pointer select-none"
                        onClick={() =>
                          currAddingCount !== 1 &&
                          setCurrAddingCount(currAddingCount - 1)
                        }
                      >
                        -
                      </div>
                      <div className="text-[35px] font-bold">
                        {currAddingCount}
                      </div>
                      <div
                        className="border rounded-full w-[50px] h-[50px] text-[30px] pt-[-50px] pl-[15px] hover:border-black cursor-pointer select-none"
                        onClick={() => setCurrAddingCount(currAddingCount + 1)}
                      >
                        +
                      </div>
                    </div>
                  </div>
                  <button
                    className="bg-black rounded-full w-full text-white h-[40px]"
                    onClick={addFoodToCard}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {foods &&
          foods.map((el) => (
            <div
              key={el._id}
              className="bg-white w-[400px] h-[350px] rounded-[10px] p-[20px]"
            >
              <div className="rounded-[8px] border h-[220px]">
                <img src={el.image} className="w-full h-full object-cover" />
                <div
                  className="mt-[-58px] ml-[300px] pl-[12px] leading-[42px] absolute border w-[50px] h-[50px] rounded-full bg-white text-red-400 text-[40px] cursor-pointer"
                  onClick={() => handlePlus(el)}
                >
                  +
                </div>
              </div>
              <div className="w-full h-[100px] text-black">
                <div className="flex justify-between mt-[10px] items-center">
                  <div className="text-[30px] font-bold text-red-500 flex w-[290px] truncate">
                    {el.foodName}
                  </div>
                  <div className="text-[20px]">{el.price}$</div>
                </div>
                <div className="line-clamp-2 overflow-ellipsis">
                  {el.ingredients}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
