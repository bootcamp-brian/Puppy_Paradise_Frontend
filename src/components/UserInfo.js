import * as React from "react";
import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUser } from "../utils/API";
import Title from "./Title";
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import EditUserInfo from "./EditUserInfo";

const UserInfo = () => {
  const [token] = useOutletContext();
  const [user, setUser] = useState({});
  const [shippingAddress, setShippingAddress] = useState({})
  const [billingAddress, setBillingAddress] = useState({})

  useEffect(() => {
    async function getUserInfo() {
        const results = await getUser(token);
        setUser(results);
        setShippingAddress(results.shippingAddress);
        setBillingAddress(results.billingAddress);
    }
    getUserInfo();
  }, [token]);

  const { firstName, lastName, email, phone } = user;

  return (
    <>
        <Title>Account Info</Title>
        <Grid container spacing={3}>
            <Grid item xs={4}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 150,
                    }}
                >
                    <Typography component="p" variant="h5"> {firstName} {lastName} </Typography>
                    <Typography color="text.secondary" sx={{ flex: 1 }}> {email} </Typography>
                    <Typography> {phone} </Typography>
                </Paper>
            </Grid>
            <Grid item xs={4}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 150,
                    }}
                >
                    <Typography component="p" variant="h6" color="text.secondary" sx={{ flex: 1 }}> Shipping Address </Typography>
                    <Typography> {shippingAddress.address} </Typography>
                    <Typography> {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip} </Typography>
                </Paper>
            </Grid>
            <Grid item xs={4}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 150,
                    }}
                >
                    <Typography component="p" variant="h6" color="text.secondary" sx={{ flex: 1 }}> Billing Address </Typography>
                    <Typography> {billingAddress.address} </Typography>
                    <Typography> {billingAddress.city}, {billingAddress.state} {billingAddress.zip} </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 100,
                    }}
                >
                    <EditUserInfo 
                        token={token}
                        user={user}
                        setUser={setUser}
                        setShippingAddress={setShippingAddress}
                        setBillingAddress={setBillingAddress}
                    />
                </Paper>
            </Grid>
        </Grid>
    </>
  );
}

export default UserInfo;