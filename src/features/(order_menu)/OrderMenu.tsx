import { useEffect, useState } from "react";
import "../../app/globals.css";
import { ShoppingCart, X, Soup, Timer, Map } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

export default function OrderMenu(props) {
  const { ordermenu, setOrdermenu, orderList, setOrderList, id, name} = props;
  const [orderState, setOrderState] = useState(1);
  const [total, setTotal] = useState<number>(0);
  const [orderHistory, setOrderHistory] = useState([]);

  const handleDecrease = (index) => {
    setOrderList((prevList) => {
      const newList = [...prevList];
      if (newList[index][1] > 1) {
        newList[index] = [newList[index][0], newList[index][1] - 1];
      }
      return newList;
    });
  };

  const handleIncrease = (index) => {
    setOrderList((prevList) => {
      const newList = [...prevList];
      newList[index] = [newList[index][0], newList[index][1] + 1];
      return newList;
    });
  };

  useEffect(() => {
    let sum = 0;
    orderList.forEach((element) => {
      sum += element[0].price * element[1];
    });
    setTotal(sum);
  }, [orderList]);

  const checkout = async () => {
    const response = await axios.post("http://localhost:3001/users/find", {
      id: id,
    },
    { headers: { Authorization: `Bearer ${window.localStorage.authToken}` } });
    if (!response.data.location) {
      toast.info("Enter your location");
    } else if (!orderList.length) {
      toast.info("Buy at least one item");
    } else {
      const res = await axios.post("http://localhost:3001/order/", {
        user: id,
        username: name,
        totalPrice: total,
        foodOrderItems: orderList,
        location: response.data.location
      },
      { headers: { Authorization: `Bearer ${window.localStorage.authToken}` } });
      setOrderList([]);
      setOrdermenu(false);
    }
  };
  

  useEffect(() => {
    const getOrder = async () => {
      const response = await axios.post("http://localhost:3001/order/history", {
        user: id,
      },
      { headers: { Authorization: `Bearer ${window.localStorage.authToken}` } });
      setOrderHistory(response.data);
    };

    getOrder();
  }, [ordermenu]);
  
  
  return (
    <div className="fixed w-screen h-screen bg-black/20 top-0 z-50 flex justify-center">
      <ToastContainer position="top-center"/>
      <div
        className="h-full w-[calc(100vw-600px)]"
        onClick={() => setOrdermenu(false)}
      ></div>
      <div className="h-full w-[600px] bg-[#404040] move-in rounded-l-[15px] p-[30px] pt-[40px] flex flex-col gap-[24px]">
        <div className="flex text-[20px] items-center gap-[15px]">
          <ShoppingCart />
          <div>Order detail</div>
        </div>
        <div className="w-full bg-white rounded-full min-h-[50px] p-[3px] flex text-black cursor-pointer">
          <div
            className={
              orderState === 2
                ? "w-1/2 h-full rounded-full flex justify-center items-center"
                : "w-1/2 h-full rounded-full flex justify-center items-center bg-red-500 text-white"
            }
            onClick={() => {
              setOrderState(1);
            }}
          >
            <p>Cart</p>
          </div>
          <div
            className={
              orderState === 1
                ? "w-1/2 h-full rounded-full flex justify-center items-center"
                : "w-1/2 h-full rounded-full flex justify-center items-center bg-red-500 text-white"
            }
            onClick={() => {
              setOrderState(2);
            }}
          >
            <p>Order</p>
          </div>
        </div>
        {orderState === 1 ? (
          <div className="flex flex-col gap-[30px] h-full">
            <div className="w-full bg-white rounded-[20px] p-[20px] text-black overflow-scroll h-[565px]">
              <div className="text-[25px] font-bold">My cart</div>
              <div className="flex flex-col">
                {orderList.map((el, index) => (
                  <div
                    className={`w-full h-[135px] pt-[15px] mt-[15px] overflow-hidden flex ${
                      index === 0 ? "" : " border-t-[2px] border-dashed"
                    }`}
                    key={el[0]._id}
                  >
                    <div className="rounded-[6px] w-[160px] h-[120px] overflow-hidden">
                      <img
                        src={el[0].image}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="w-full h-full ml-[30px]">
                      <div className="w-full h-[60px] flex">
                        <div className="w-full">
                          <div className="text-red-500 text-[18px] font-bold">
                            {el[0].foodName}
                          </div>
                          <div className="text-[15px] font-light mt-[5px]">
                            {el[0].ingredients}
                          </div>
                        </div>
                        <div className="w-[50px]">
                          <div
                            className="p-[8px] border border-[#EF4444] rounded-full"
                            onClick={() =>
                              setOrderList((prevList) =>
                                prevList.filter((_, i) => i !== index)
                              )
                            }
                          >
                            <X stroke="#EF4444" />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between h-[50px] items-end">
                        <div className="flex gap-[20px] text-[20px]">
                          <div
                            className="select-none"
                            onClick={() => handleDecrease(index)}
                          >
                            -
                          </div>
                          <div className="font-bold">{el[1]}</div>
                          <div
                            className="select-none"
                            onClick={() => handleIncrease(index)}
                          >
                            +
                          </div>
                        </div>
                        <div className="text-[17px] font-bold">
                          ${(el[0].price * el[1]).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full h-[280px] bg-white rounded-[20px] text-black p-[20px]">
              <div className="text-[26px] font-bold">Payment info</div>
              <div>
                <div className="flex justify-between mt-[15px]">
                  <div className="text-[18px] text-gray-600 font-light">
                    Items
                  </div>
                  <div className="text-[18px] font-bold">${total.toFixed(2)}</div>
                </div>
                <div className="flex justify-between mt-[10px]">
                  <div className="text-[18px] text-gray-600 font-light">
                    Shipping
                  </div>
                  <div className="text-[18px] font-bold">$0.99</div>
                </div>
                <div className="flex justify-between mt-[15px] pt-[15px] border-t-[2px] border-dashed">
                  <div className="text-[18px] text-gray-600 font-light">
                    Total
                  </div>
                  <div className="text-[18px] font-bold">${(total + 0.99).toFixed(2)}</div>
                </div>
              </div>
              <button
                className="bg-red-500 w-full h-[40px] text-white rounded-full mt-[20px]"
                onClick={checkout}
              >
                Checkout
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full p-[20px] rounded-[20px] w-full bg-white text-black overflow-scroll">
            <div className="text-[25px] font-bold">Order history</div>
            <div className="flex flex-col-reverse">
              {orderHistory &&
                orderHistory.map((el, index) => (
                  <div
                    key={index}
                    className={`w-full h-fit my-[10px] py-[10px] ${
                      index && "border-b"
                    }`}
                  >
                    <div className="w-full flex justify-between mb-[10px]">
                      <div className="text-[20px] font-bold">
                        ${el.totalPrice}
                      </div>
                      <div
                        className={`border rounded-full px-[10px] text-[14px] flex items-center ${
                          el.status === "PENDING"
                            ? "border-red-500"
                            : el.status === "DELIVERED" ? "border-green-500 bg-green-100" : "bg-gray-200"
                        }`}
                      >
                        {el.status}
                      </div>
                    </div>
                    {el.foodOrderItems &&
                      el.foodOrderItems.map((elem, ind) => (
                        <div
                          key={ind}
                          className="flex justify-between items-center"
                        >
                          <div className="flex gap-[5px] text-gray-500 font-extralight text-[15px] my-[5px] items-center">
                            <Soup height={18} strokeWidth={1} />
                            <div>{elem[0].foodName}</div>
                          </div>
                          <div className="font-light text-[16px]">
                            x {elem[1]}
                          </div>
                        </div>
                      ))}
                    <div className="flex gap-[5px] text-gray-500 font-extralight text-[15px] my-[5px] items-center">
                      <Timer height={18} strokeWidth={1} />
                      <div>{el.createdAt.substring(0,10).split('-').join('/')}</div>
                    </div>
                    <div className="flex gap-[5px] text-gray-500 font-extralight text-[15px] my-[5px] items-center">
                      <Map height={18} strokeWidth={1} />
                      <div>{el.location}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
