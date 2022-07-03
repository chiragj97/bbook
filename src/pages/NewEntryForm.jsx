import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { addNewEntry, updateEntry } from "../apiHelper";
import { useStateContext } from "../contexts/ContextProvider";
import Swal from "sweetalert2";

const NewEntryForm = ({ updateRecord, history }) => {
  const [timePeriod, setTimePeriod] = useState(1);
  const [issuedDate, setIssuedDate] = useState(new Date(Date.now()));
  const [returnDate, setReturnDate] = useState(
    new Date(Date.now()).setMonth(new Date(Date.now()).getMonth() + 1)
  );

  const getExpireDate = (date) => {
    return new Date(
      new Date(date).setFullYear(new Date(date).getFullYear() + 1)
    ).setDate(
      new Date(
        new Date(date).setFullYear(new Date(date).getFullYear() + 1)
      ).getDate() + 15
    );
  };
  const [expireDate, setExpireDate] = useState(getExpireDate(Date.now()));
  const [totalInterest, setTotalInterest] = useState(0);
  const [netTotal, setNetTotal] = useState(0);
  const [checked, setChecked] = useState(false);
  const { setUpdateRecord } = useStateContext();
  const {
    control,
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();
  const interest = Number(watch("interest"));
  const loanAmount = Number(watch("loanAmount"));
  console.log("valll", getValues());
  const onSubmit = async (data) => {
    console.log("dataentry", data.entryType);
    data.issuedDate = new Date(issuedDate);
    data.returnDate = new Date(returnDate);
    data.expireDate = new Date(expireDate);
    data.timePeriod = timePeriod;
    console.log(data);
    {
      updateRecord.customerName !== undefined
        ? await entryUpdate(data)
        : await entryAdd(data);
    }
    setUpdateRecord({});
  };
  console.log(errors);

  const entryAdd = async (data) => {
    let addStatus = await addNewEntry(data);
    if (addStatus.status) {
      Swal.fire("Success", "Entry Added Successfully!", "success");
    } else {
      Swal.fire("Oop's", "Your entry could not be added", "error");
    }
  };

  const entryUpdate = async (data) => {
    data._id = updateRecord._id;
    let updateStatus = await updateEntry(data);
    if (updateStatus.status) {
      Swal.fire("Success", "Entry Updated!", "success");
    } else {
      Swal.fire("Oop's", "Your entry could not be updated", "error");
    }
  };

  const theme = createTheme();

  function valuetext(value) {
    return `${value} month(s)`;
  }

  useEffect(() => {
    //   setValue("customerName", "Hila")
    setTimePeriod(
      updateRecord["timePeriod"] !== undefined ? updateRecord["timePeriod"] : 1
    );
    Object.entries(getValues()).forEach(([key]) => {
      //   console.log(key, value);
      console.log("date", key.substr(key.length - 4));
      if (key.substr(key.length - 4) === "Date") {
        //   setValue(key, new Date(updateRecord[key]))
        setIssuedDate(
          updateRecord["issuedDate"] !== undefined
            ? updateRecord["issuedDate"]
            : new Date(Date.now())
        );
      } else {
        setValue(key, updateRecord[key]);
      }
    });
  }, [updateRecord]);

  const handleDateChange = (date, field) => {
    // console.log("date", date);
    field.onChange(date);
    setIssuedDate(date);
    setReturnDate(
      new Date(new Date(date).setMonth(new Date(date).getMonth() + timePeriod))
    );
    setExpireDate(getExpireDate(date));
  };

  const handleKeyPress = (e) => {
    // console.log('Event: ',event)
    if (e.key === "Enter") {
      console.log("here as well");
      setValue("entryType", 1);
    }
    if (e.shiftKey && e.which === 13) {
      console.log("here");
      setValue("entryType", 2);
    }
    handleSubmit(onSubmit);
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

  useEffect(() => {
    console.log("here", timePeriod);
    //   let totalInterest = (loanAmount * interest * timePeriod) / 100;
    //   setTotalInterest(Number(totalInterest));
    //   setNetTotal(Number(loanAmount + totalInterest));

    let stats = calculateInterest(interest, loanAmount, timePeriod);
    setTotalInterest(stats.totalInterest);
    setNetTotal(stats.netTotal);
  }, [interest, loanAmount, timePeriod]);

  const calculateInterest = (interest, loanAmount, timePeriod) => {
    let totalInterest = (loanAmount * interest * timePeriod) / 100;
    let netTotal = loanAmount + totalInterest;
    console.log(totalInterest, loanAmount, interest, timePeriod);
    if (Number(totalInterest) > 0) {
      return { totalInterest, netTotal };
    } else {
      return { totalInterest: 0, netTotal: 0 };
    }
  };

  useEffect(() => {
    console.log("hereee", timePeriod, issuedDate);
    setReturnDate(
      new Date(
        new Date(issuedDate).setMonth(
          new Date(issuedDate).getMonth() + timePeriod
        )
      )
    );

    setExpireDate(getExpireDate(issuedDate));
  }, [issuedDate, timePeriod]);

  return (
    // console.log("i,t", interest, loanAmount, tenure, netTotal, totalInterest),
    <div>
      {/* <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Customer Name"
          {...register("customerName", { required: true, maxLength: 80 })}
        />
        <Controller
          name="customerName"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <label htmlFor="customerName">
              Customer Name: &nbsp;&nbsp;
              <input id="customerName" className="border-solid border-2 rounded" {...field} />
            </label>
          )}
        />
        <input type="submit" />
      </form> */}
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="fluid">
          <CssBaseline />
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                marginTop: 8,
                // display: "flex",
                alignItems: "center",
              }}
            >
              {/* <Grid container >       */}
              <div>
                <strong>Customer Details</strong>
                <Grid container spacing={2}>
                  {/* <div> */}
                  <Grid item xs={3}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="customerName"
                      label="Customer Name"
                      name="customerName"
                      autoComplete="Customer Name"
                      defaultValue="Hola"
                      autoFocus
                      {...register("customerName", {
                        required: true,
                      })}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="customerAddress"
                      label="Address"
                      name="customerAddress"
                      autoComplete="Address"
                      {...register("customerAddress", {
                        required: true,
                      })}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="aadharNo"
                      label="Aadhar No"
                      name="aadharNo"
                      autoComplete="Aadhar No"
                      {...register("aadharNo", {
                        required: false,
                      })}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      margin="normal"
                      fullWidth
                      required
                      id="mobile"
                      label="Mobile No"
                      name="mobile"
                      autoComplete="Mobile No"
                      {...register("mobile", {
                        required: true,
                      })}
                    />
                  </Grid>
                </Grid>
              </div>
              {/* <Grid item xs={2}>
                  <Button variant="contained" component="label">
                    Customer Image
                    <input type="file" hidden />
                  </Button>
                </Grid> */}
              {/* <div> */}
              <div>
                <strong>Item Details</strong>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="itemName"
                      label="Item Name"
                      name="itemName"
                      autoComplete="Item Name"
                      {...register("itemName", {
                        required: true,
                      })}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="itemCategory"
                      label="Item Category"
                      name="itemCategory"
                      autoComplete="Item Category"
                      {...register("itemCategory", {
                        required: true,
                      })}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="itemWeight"
                      label="Item Weight ( in gms )"
                      name="itemWeight"
                      autoComplete="Item weight in gms"
                      {...register("itemWeight", {
                        required: true,
                      })}
                    />
                  </Grid>
                </Grid>
              </div>
              <div>
                <strong>Pricing Details</strong>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="interest"
                      label="Interest (per month)"
                      name="interest"
                      autoComplete="Interest"
                      {...register("interest", {
                        required: true,
                      })}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="marketPrice"
                      label="Market Value"
                      name="marketPrice"
                      autoComplete="Market Value"
                      {...register("marketPrice", {
                        required: true,
                      })}
                    />
                  </Grid>
                  {/* <Grid item xs={4}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="myPrice"
                        label="My Price"
                        name="myPrice"
                        autoComplete="My Price"
                        {...register("myPrice", {
                          required: true,
                        })}
                      />
                    </Grid> */}
                  <Grid item xs={4}>
                    <TextField
                      margin="normal"
                      fullWidth
                      required
                      id="loanAmount"
                      label="Loan Amount"
                      name="loanAmount"
                      autoComplete="Loan Amount"
                      {...register("loanAmount", {
                        required: true,
                      })}
                    />
                  </Grid>
                </Grid>
              </div>
              <div>
                <strong>Time Period</strong>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography gutterBottom>Duration (in months)</Typography>
                    <Controller
                      control={control}
                      name="timePeriod"
                      render={({ field }) => (
                        <Slider
                          //   aria-label="Temperature"
                          defaultValue={1}
                          getAriaValueText={valuetext}
                          valueLabelDisplay="auto"
                          valueLabelFormat={(value) => {
                            // setTimePeriod(Number(value));
                            return `${value} months`;
                          }}
                          step={1}
                          // name="timePeriod"
                          value={timePeriod ?? 1}
                          onChange={(e, val) => {
                            //   console.log("lll", val);
                            setTimePeriod(Number(val));
                            //   setIssuedDate(date);
                            // setReturnDate(
                            //   new Date(
                            //     new Date(issuedDate).setMonth(
                            //       new Date(issuedDate).getMonth() + Number(val)
                            //     )
                            //   )
                            // );
                            // setExpireDate(getExpireDate(issuedDate));
                          }}
                          marks
                          min={1}
                          max={12}
                        />
                      )}
                    />
                    {/* <Typography gutterBottom>Duration (in months)</Typography>
                      <Slider
                        aria-label="Temperature"
                        defaultValue={1}
                        getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => {
                          setTimePeriod(Number(value));
                          return `${value} months`;
                        }}
                        step={1}
                        name="timePeriod"
                        // value={timePeriod}
                        // onChange={(e, val)=>{
                        //     e.preventDefault()
                        //     console.log(val);
                        // }}
                        marks
                        min={1}
                        max={12}
                        {...register("timePeriod", {
                          required: true,
                        })} */}
                  </Grid>
                  <Grid item xs={4}>
                    <Controller
                      control={control}
                      name="issuedDate"
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="Issued Date"
                            value={issuedDate}
                            //   name="issuedDate"
                            onChange={(date) => handleDateChange(date, field)}
                            inputFormat="dd/MM/yyyy"
                            renderInput={(params) => <TextField {...params} />}
                            //   {...register("issuedDate", {
                            //     required: true,
                            //   })}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Return Date"
                        value={returnDate}
                        name="returnDate"
                        readOnly
                        inputFormat="dd/MM/yyyy"
                        renderInput={(params) => <TextField {...params} />}
                        {...register("returnDate", {
                          required: false,
                        })}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Expiry Date"
                        value={expireDate}
                        name="expireDate"
                        readOnly
                        inputFormat="dd/MM/yyyy"
                        renderInput={(params) => <TextField {...params} />}
                        {...register("expireDate", {
                          required: false,
                        })}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid className="p-2" item xs={6}>
                    Total Interest: <p>{Number(totalInterest)}</p>
                  </Grid>
                  <Grid item xs={6}>
                    Total Amount: <p>{Number(netTotal)}</p>
                  </Grid>
                  <input
                    style={{ display: "none" }}
                    name="entryType"
                    {...register("entryType", { required: false })}
                  />
                </Grid>
              </div>
              {/* <Grid item xs={3}>
                  <Button variant="contained" component="label">
                    Item Image
                    <input type="file" hidden />
                  </Button>
                </Grid> */}
              {/* </Grid> */}
            </Box>
            <Button
              type="submit"
              fullWidth
              className="md-width-sm"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {updateRecord.customerName !== undefined ? "Save" : "Add Entry"}
            </Button>
          </form>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default NewEntryForm;
