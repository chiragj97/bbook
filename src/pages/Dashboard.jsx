import React, { useEffect, useState, useCallback } from "react";
import { getUserData } from "../apiHelper";
import { useKeyPress } from "../components/useKeyPress";

import { earningData } from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";
import CustomDatatable from "../components/CustomDatatable";

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [dashboardData, setDashboardData] = useState([]);
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    getUserData(true).then((data) => {
      console.log("data", data);
      setEntries(data.data.entries);
    });
    earningData().then((data) => {
      setDashboardData(data);
    });
  }, []);

  const handleKeyPress = (e) => {
    console.log("Event: ", event);
    if (e.ctrlKey && e.which === 87) {
      setDisplay(!display);
    }
  };

  // useKeyPress(['a', 'b', 'c'], handleKeyPress);

  useEffect(() => {
    // attach the event listener
    document.addEventListener("keydown", handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="mt-4">
      <div className="flex flex-wrap lg:flex-nowrap justify-center ">
        <div
          className={`flex m-3 flex-wrap justify-center gap-10 items-center ${
            !display ? "visibility: hidden" : ""
          } `}
        >
          {/* <div
            className=" rounded-2xl md:w-1000 p-4 m-3"
            style={{ backgroundColor: currentColor }}
          >
            <div className="flex justify-between items-center ">
              <p className="font-semibold text-white text-2xl">Earnings</p>

              <div>
                <p className="text-2xl text-white font-semibold mt-8">₹63,448.78</p>
                <p className="text-gray-200">Monthly revenue</p>
              </div>
            </div>

            <div className="mt-4">
              <SparkLine currentColor={currentColor} id="column-sparkLine" height="100px" type="Column" data={SparklineAreaData} width="320" color="rgb(242, 252, 253)" />
            </div>
          </div> */}
          {dashboardData.map((item) => (
            <div
              key={item.title}
              className={`bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl hover:drop-shadow-xl`}
            >
              <button
                type="button"
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
                {item.icon}
              </button>
              <p className="mt-3">
                <span className="text-lg font-semibold">{item.amount}</span>
                <span className={`text-sm text-${item.pcColor} ml-2`}>
                  {item.percentage}
                </span>
              </p>
              <p className="text-sm text-gray-400 mt-1">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap justify-center">
        <CustomDatatable entries={entries} title="Today's Customers" />
      </div>
    </div>
  );
};

export default Dashboard;
