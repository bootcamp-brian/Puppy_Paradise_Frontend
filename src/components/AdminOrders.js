import * as React from 'react';
import { Paper, Grid, Table, TableHead, TableCell, TableRow, TableBody, Link, CardActionArea, Button } from "@mui/material";
import { useState, useEffect } from 'react';
import { adminGetAllOrders } from '../utils/API';
import Title from './Title';

const AdminOrders = ({ adminToken }) => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    function preventDefault(event) {
        event.preventDefault();
      }
    const renderAdminOrders = async () => {
        setIsLoading(true);
            const allOrders = await adminGetAllOrders(adminToken);
            setOrders(allOrders);

        setIsLoading(false);
    }

    useEffect(() => {
        renderAdminOrders();
    }, []);

    return (
        <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
                <Paper
                    sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                    }}
                >
                    {/* <Chart /> */}
                </Paper>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
                <Paper
                    sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                    }}
                >
                    {/* <Deposits /> */}
                </Paper>
            </Grid>
            {/* Recent Orders */}
            <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <Title>Recent Orders</Title>
                    <Table size="small">
                        <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>User I.D.</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Sale Amount</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {orders.map((order) => (
                            <TableRow>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>{order.userId}</TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell>{order.status !== 'Cancelled' ? `$${order.total}` : "N/A"}</TableCell>
                                <TableCell align="right">
                                    <Button variant="contained" size="small">
                                        View
                                    </Button>
                                    <Button variant="contained" size="small" sx={{ ml: 1 }}>
                                        Update
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
                        See more orders
                    </Link>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default AdminOrders;