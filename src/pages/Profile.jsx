import React from "react";
import { Header } from "../components";
import { TextField, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { useStateContext } from "../contexts/ContextProvider";

const Profile = () => {
    const { register, handleSubmit, setValue } = useForm();

    const {userDetails} = useStateContext()

    const onSubmit = data => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header title="Profile" />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            margin="normal"
            fullWidth
            name="Name"
            label="Name"
            id="Name"
            autoComplete="Name"
            defaultValue={userDetails.name}
            {...register("name")}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            margin="normal"
            fullWidth
            name="organizationAddress"
            label="Address"
            id="organizationAddress"
            autoComplete="organizationAddress"
            {...register("organizationAddress")}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            margin="normal"
            fullWidth
            name="email"
            label="Email"
            id="email"
            autoComplete="Email"
            {...register("email")}
            defaultValue={userDetails.email}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            margin="normal"
            fullWidth
            name="phoneNumber"
            label="Phone Number"
            id="phoneNumber"
            autoComplete="Phone Number"
            {...register("mobile")}
            defaultValue={userDetails.mobile}
          />
        </Grid>
      </Grid>

    </div>
    </form>
  );
};

export default Profile;
