import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { FiEdit, FiCheck } from "react-icons/fi";
import { Grid, TextField } from "@mui/material";
import { Header } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const CustomDatatable = (props) => {
  const [completed, setCompleted] = useState(false);
  const { setUpdateRecord } = useStateContext();
  const [entries, setEntries] = useState(props.entries)
  const [startDate, setStartDate] = useState(
    new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    // new Date(Date.now()) 
  );
  const [endDate, setEndDate] = useState(new Date(Date.now()));
  const columns = [
    {
      name: "customerName",
      label: "Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "itemName",
      label: "Item",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "itemWeight",
      label: "Weight",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "itemCategory",
      label: "Category",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "aadharNo",
      label: "Aadhar",
      options: {
        filter: true,
        sort: false,
        display: false,
      },
    },
    {
      name: "mobile",
      label: "Mobile",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "interest",
      label: "Interest",
      options: {
        filter: true,
        sort: true,
        display: false,
      },
    },
    {
      name: "marketPrice",
      label: "Market Price",
      options: {
        filter: true,
        sort: true,
        display: false,
      },
    },
    {
      name: "loanAmount",
      label: "Amount",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "issuedDate",
      label: "Issued Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return <p>{new Date(value).toDateString()}</p>;
        },
      },
    },
    {
      name: "expireDate",
      label: "Expire Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return <p>{new Date(value).toDateString()}</p>;
        },
      },
    },
    {
      name: "",
      label: "Action",
      options: {
        align: "center",
        customBodyRender: (value, tableMeta) => {
          return (
            <Grid container spacing={0}>
              <Grid item xs={6}>
                <Link to="/new_entry">
                  <FiEdit
                    className="hover:scale-110"
                    onClick={() => setUpdateRecord(props.entries[tableMeta.rowIndex])}
                  />
                </Link>
              </Grid>
              <Grid item xs={6}>
                <FiCheck
                  onClick={() => handleCompleted(props.entries[tableMeta.rowIndex])}
                  className="hover:scale-125 cursor-pointer"
                />
              </Grid>
            </Grid>
          );
        },
      },
    },
    {
      name: 'status',
      label: "Status"
    }
  ];

  useEffect(() => { 
    console.log("here2")
    setEntries(props.entries);
  },[props.entries]);

  useEffect(() => {
    if(props.entries.length > 0) {
      console.log("here")
      setEntries(filterDateRange(startDate, endDate, props.entries));
    }
  }, [startDate, endDate]);


  const filterDateRange = (startDate, endDate, entries) => {
    console.log("see", startDate, endDate, entries);

    let filteredEntries = entries.filter(
      (entry) =>
        new Date(entry.issuedDate) >= new Date(startDate) &&
        new Date(entry.issuedDate) <= new Date(endDate)
    );

    console.log("fe", filteredEntries);
    return filteredEntries;
  };

  const handleCompleted = async (record) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(Date.now());
    const secondDate = new Date(record.issuedDate);

    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
    let noOfMonths;
    if (diffDays < 29) {
      noOfMonths = 1;
    } else {
      noOfMonths = Math.floor(diffDays / 29);
    }
    const totalInterest =
      (record.loanAmount * record.interest * noOfMonths) / 100;

    console.log("ti", totalInterest);
    Swal.fire({
      title: `₹${totalInterest + Number(record.loanAmount)}`,
      text: `is the total payable amount for this entry including ₹${totalInterest} of the interest amount with ${record.interest}% interest rate. Do you want to mark it completed?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Completed!", "Entry marked as completed.", "success");
      }
    });
  };

  const options = {
    responsive: "standard",
    confirmFilters: true,
  };

  return (
    console.log('ent', entries),
    <div>
      <Grid container spacing={2}>
        {/* <Grid item xs={4}>
          <Header title={props.title} />
        </Grid> */}
        <Grid item xs={8}>
          Date Range: 
        <LocalizationProvider dateAdapter={AdapterDateFns}>

        <MobileDatePicker
          label="Start Date"
          inputFormat="MM/dd/yyyy"
          value={startDate}
          onChange={(time) => setStartDate(time)}
          renderInput={(params) => <TextField {...params} />}
        />
        <MobileDatePicker
          label="End Date"
          inputFormat="MM/dd/yyyy"
          value={endDate}
          onChange={(time) => setEndDate(time)}
          renderInput={(params) => <TextField {...params} />}
        />
        </LocalizationProvider>
        </Grid>
        <Grid item xs={4}>
          <div>Hola</div>
        </Grid>
      </Grid>
      <MUIDataTable
        title={props.title}
        data={entries}
        columns={columns}
        options={options}
      />
    </div>
  );
};

export default CustomDatatable;
