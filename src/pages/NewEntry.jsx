import React from "react";
import { Header } from "../components";
import NewEntryForm from "./NewEntryForm";
import { useStateContext } from "../contexts/ContextProvider";
const NewEntry = () => {
  const { updateRecord } = useStateContext();
  console.log("ur", updateRecord);
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header
        title={`${
          updateRecord.customerName !== undefined ? "Update Entry" : "New Entry"
        }`}
      />
      <NewEntryForm updateRecord={updateRecord} />
    </div>
  );
};

export default NewEntry;
