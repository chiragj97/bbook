import React, { useEffect, useState } from "react";
import { getUserData } from "../apiHelper";
import CustomDatatable from "../components/CustomDatatable";

const Customers = () => {
  const [entries, setEntries] = useState([]);
  const [allEntries, setAllEntries] = useState([]);
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    // let filteredEntries;
    getUserData().then((data) => {
      setAllEntries(data.data.entries);
      let filteredEntries = filterEntryType(data.data.entries, 1);
      setEntries(filteredEntries);
    });
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const filterEntryType = (data, entryType) => {
    console.log("data", data);
    return data.filter((record) => record.entryType === entryType);
  };

  const handleKeyPress = (e) => {
    console.log("Event: ", e);
    if (e.shiftKey && e.which === 49) {
      let filteredEntries = filterEntryType(allEntries, 1);
      console.log("fe", filteredEntries, allEntries)
      setEntries(filteredEntries);
    } else if (e.shiftKey && e.which === 50) {
      let filteredEntries = filterEntryType(allEntries, 2);
      // console.log("fe2", filteredEntries, allEntries)
      setEntries(filteredEntries);
    }
  };

  return (
    console.log("1", entries),
    (
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <CustomDatatable entries={entries} title="Customers" />
      </div>
    )
  );
};

export default Customers;
