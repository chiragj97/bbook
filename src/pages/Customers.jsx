import React, { useEffect, useState } from "react";
import { getUserData } from "../apiHelper";
import CustomDatatable from "../components/CustomDatatable";

const Customers = () => {
  const [entries, setEntries] = useState([]);
  const [display, setDisplay] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    // new Date(Date.now())
  );
  const [endDate, setEndDate] = useState(new Date(Date.now()));

  useEffect(() => {
    // let filteredEntries;
    getUserData().then((data) => {
      let filteredEntries = filterDateRange(startDate, endDate, filterEntryType(data.data.entries, 1))
      // filteredEntries = filterEntryType(data.data.entries, 1);
      setEntries(filteredEntries);
    });
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    setEntries(filterDateRange(startDate, endDate, entries))
  }, [startDate, endDate]);

  const filterDateRange = (startDate, endDate, entries) => {
    console.log('see',startDate, endDate, entries)
    // let { startDate, endDate } = dateRange;
    // filterDateRange(startDate, endDate);
    let filteredEntries = entries.filter(
      (entry) =>
        new Date(entry.issuedDate) >= new Date(startDate) &&
        new Date(entry.issuedDate) <= new Date(endDate)
    );

    console.log('fe',filteredEntries)
    return filteredEntries
    // setEntries(filteredEntries);
  };

  const filterEntryType = (data, entryType) => {
    console.log("data", data);
    return data.filter((record) => record.entryType === entryType);
  };

  const handleKeyPress = (e) => {
    console.log("Event: ", event);
    if (e.shiftKey && e.which === 49) {
      let filteredEntries = filterEntryType(entries, 2);
      console.log("ee", entries);
      setEntries(filteredEntries);
      console.log("fe", filteredEntries);
      setDisplay(!display);
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <input type="text" />
      <CustomDatatable entries={entries} title="Customers" />
    </div>
  );
};

export default Customers;
