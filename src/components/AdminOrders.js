import * as React from 'react';
import { Paper, Grid, Table, TableHead, TableCell, TableRow, TableBody, Button, Box, Modal, Typography, Zoom } from "@mui/material";
import { useState, useEffect } from 'react';
import { adminEditOrderStatus, adminGetAllOrders, adminGetOrderById } from '../utils/API';
import Title from './Title';

const AdminOrders = ({ adminToken, setIsLoading }) => {
    const [orders, setOrders] = useState([]);
    const [ordersEndIndex, setOrdersEndIndex] = useState(5);
    const [ordersTotal, setOrdersTotal] = useState(0)
    const [updateWindowOpen, setUpdateWindowOpen] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState(0);
    const [sortMethod, setSortMethod] = useState('date');
    const [sortMethodDescending, setSortMethodDescending] = useState(true);
    const [viewedOrderStatus, setViewedOrderStatus] = useState('');
    const [featuredOrder, setFeaturedOrder] = useState({})
    const [zoom, setZoom] = useState(true);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 10,
        p: 4,
        display: 'flex',
        justifyContent: 'space-around'
    };

    const handleShowMoreButtonClick = () => {
        setIsLoading(true);
        setOrdersEndIndex(ordersEndIndex + 5);
        setIsLoading(false);
    }

    const handleUpdateStatusButtonClick = (event) => {
        setIsLoading(true);
        setViewedOrderStatus(featuredOrder.status);
        setCurrentOrderId(featuredOrder.id);
        setUpdateWindowOpen(true);
        setIsLoading(false);
    }

    const handleUpdateWindowClose = () => {
        setIsLoading(true);
        setViewedOrderStatus('');
        setCurrentOrderId(0);
        setUpdateWindowOpen(false);
        setIsLoading(false);
    }

    const handleSetStatusButtonClick = async (event) => {
        setIsLoading(true);
        const newStatus = event.target.getAttribute('data-statussubmission');
        await adminEditOrderStatus(adminToken, currentOrderId, newStatus);
        setViewedOrderStatus('');
        setCurrentOrderId(0);
        setUpdateWindowOpen(false);
        setIsLoading(false);
    }

    const handleHeaderClick = (event) => {
        setIsLoading(true);
        const header = event.target.getAttribute('data-header');
        if (sortMethod === header) {
            setSortMethodDescending(!sortMethodDescending);
        } else {
            setSortMethod(header);
            setSortMethodDescending(false);
        }
        setIsLoading(false);
    }

    const handleViewButtonClick = async (event) => {
        setIsLoading(true);
        setZoom(false);
        const orderId = event.target.getAttribute('data-viewid');
        const newFeaturedOrder = await adminGetOrderById(adminToken, orderId);
        setFeaturedOrder(newFeaturedOrder);
        setZoom(true);
        setIsLoading(false);
    }

    const renderAdminOrders = async () => {
        setIsLoading(true);
        const allOrders = await adminGetAllOrders(adminToken);

        if (Object.keys(featuredOrder).length === 0) {
            setFeaturedOrder(allOrders[0]);
        } else {
            const newFeaturedOrder = await adminGetOrderById(adminToken, featuredOrder.id);
            setFeaturedOrder(newFeaturedOrder);
        }

        setOrdersTotal(allOrders.length);
        const ordersToShow = allOrders.slice(0, ordersEndIndex);

        if (sortMethod === 'date') {
            if (sortMethodDescending) {
                ordersToShow.sort((a, b) => {
                    const dateA = Date.parse(a.date);
                    const dateB = Date.parse(b.date);
                    return dateB - dateA;
                })
            } else {
                ordersToShow.sort((a, b) => {
                    const dateA = Date.parse(a.date);
                    const dateB = Date.parse(b.date);
                    return dateA - dateB;
                })
            }
        } else if (sortMethod === 'userId') {
            if (sortMethodDescending) {
                ordersToShow.sort((a, b) => {
                    return Number(b.userId) - Number(a.userId);
                })
            } else {
                ordersToShow.sort((a, b) => {
                    return Number(a.userId) - Number(b.userId);
                })
            }
        } else if (sortMethod === 'status') {
            const map = {
                'Cancelled': 1,
                'Completed': 2,
                'Created': 3,
                'Processing': 4,
            }
            if (sortMethodDescending) {
                ordersToShow.sort((a, b) => {
                    return map[b.status] - map[a.status];
                })
            } else {
                ordersToShow.sort((a, b) => {
                    return map[a.status] - map[b.status];
                })
            }
        } else if (sortMethod === 'sale') {
            if (sortMethodDescending) {
                ordersToShow.sort((a, b) => {
                    const saleA = a.total ? a.total : 0;
                    const saleB = b.total ? b.total : 0;
                    return saleB - saleA;
                })
            } else {
                ordersToShow.sort((a, b) => {
                    const saleA = a.total ? a.total : 0;
                    const saleB = b.total ? b.total : 0;
                    return saleA - saleB;
                })
            }
        }

        setOrders(ordersToShow);
        setIsLoading(false);
    }

    useEffect(() => {
        renderAdminOrders();
    }, [updateWindowOpen, ordersEndIndex, sortMethod, sortMethodDescending]);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Zoom in={zoom} style={{ transitionDelay: zoom ? '500ms' : '0ms' }}>
                    <Paper
                        sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column'
                        }}
                    >
                        <Typography variant="h4" component="h2" sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            pb: 1,
                            borderBottom: '1px solid black',
                            mb: 1
                        }}>
                            Viewing Order #{featuredOrder.id}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 'bold' }}>
                                Created: {featuredOrder.date}
                            </Typography>
                            <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 'bold' }}>
                                Status: {featuredOrder.status}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                            <Button
                                // data-updateid={order.id}
                                // data-status={order.status}
                                variant="contained"
                                size="small"
                                onClick={handleUpdateStatusButtonClick}
                                sx= {{
                                    ml: 1,
                                    background: 'green',
                                    ":hover": {
                                        bgcolor: "#106B21",
                                        color: "white" }
                                }}
                            >
                                Update Status
                            </Button>
                            <Modal
                                open={updateWindowOpen}
                                onClose={handleUpdateWindowClose}
                                slotProps={{ backdrop: {sx: { background: 'rgba(0, 0, 0, 0.2)'}}}}
                            >
                                <Box sx={style}>
                                    <Button
                                        disabled={viewedOrderStatus === 'Created' ? true : false}
                                        data-statussubmission="Created"
                                        variant="outlined"
                                        size="large"
                                        onClick={handleSetStatusButtonClick}
                                    >
                                        Created
                                    </Button>
                                    <Button
                                        disabled={viewedOrderStatus === 'Processing' ? true : false}
                                        data-statussubmission="Processing"
                                        variant="outlined"
                                        size="large"
                                        onClick={handleSetStatusButtonClick}
                                    >
                                        Processing
                                    </Button>
                                    <Button
                                        disabled={viewedOrderStatus === 'Completed' ? true : false}
                                        data-statussubmission="Completed"
                                        variant="outlined"
                                        size="large"
                                        onClick={handleSetStatusButtonClick}
                                    >
                                        Completed
                                    </Button>
                                    <Button
                                        disabled={viewedOrderStatus === 'Cancelled' ? true : false}
                                        data-statussubmission="Cancelled"
                                        variant="outlined"
                                        size="large"
                                        onClick={handleSetStatusButtonClick}
                                    >
                                        Cancelled
                                    </Button>
                                </Box>
                            </Modal>
                        </Box>
                        <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 'bold' }}>
                            Items:
                        </Typography>
                        <Box sx= {{ pl: 5, mb: 1, pr: 5 }}>
                            <Table size="small">
                                <TableBody>
                                    {
                                        Object.keys(featuredOrder).length === 0 ||
                                        featuredOrder.items.length === 0
                                        ?
                                        <TableRow>
                                            <TableCell align="center">
                                                <Typography variant="h6" component="p">
                                                    No Items to Display
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        :
                                        featuredOrder.items.map(item => {
                                            return (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <Typography variant="caption" component="p">
                                                            Puppy I.D. - {item.id}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="caption" component="p">
                                                            {item.name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="caption" component="p">
                                                            ${item.price}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </Box>
                            <Typography align="right" variant="subtitle1" component="h3" sx={{ fontWeight: 'bold' }}>
                                Total: ${featuredOrder.total}
                            </Typography>
                    </Paper>
                </Zoom>
            </Grid>
            {/* Recent Orders */}
            <Grid item xs={12}>
                <Paper sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    {
                        orders.length === 0
                        ?
                        <Typography variant="subtitle" component="h3" >
                            No Recent Orders
                        </Typography>
                        :
                        <>
                            <Title>Recent Orders</Title>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            data-header='date'
                                            title={`Sort ${sortMethodDescending ? 'ascending' : 'descending'}`}
                                            sx={{
                                                ":hover": {
                                                cursor: 'pointer',
                                                background: 'lightgray'
                                            }}}
                                            onClick={handleHeaderClick}
                                        >
                                            Date
                                        </TableCell>
                                        <TableCell
                                            data-header='userId'
                                            title={`Sort ${sortMethodDescending ? 'ascending' : 'descending'}`}
                                            sx={{
                                                ":hover": {
                                                cursor: 'pointer',
                                                background: 'lightgray'
                                            }}}
                                            onClick={handleHeaderClick}
                                        >
                                            User I.D.
                                        </TableCell>
                                        <TableCell
                                            data-header='status'
                                            title={`Sort ${sortMethodDescending ? 'ascending' : 'descending'}`}
                                            sx={{
                                                ":hover": {
                                                cursor: 'pointer',
                                                background: 'lightgray'
                                            }}}
                                            onClick={handleHeaderClick}
                                        >
                                            Status
                                        </TableCell>
                                        <TableCell
                                            data-header='sale'
                                            title={`Sort ${sortMethodDescending ? 'ascending' : 'descending'}`}
                                            sx={{
                                                ":hover": {
                                                cursor: 'pointer',
                                                background: 'lightgray'
                                            }}}
                                            onClick={handleHeaderClick}
                                        >
                                            Sale Amount
                                        </TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                    {
                                        <TableBody>
                                            {
                                                orders.map((order) => (
                                                    <TableRow key={order.id}>
                                                        <TableCell >{order.date}</TableCell>
                                                        <TableCell>{order.userId}</TableCell>
                                                        <TableCell>{order.status}</TableCell>
                                                        <TableCell>{order.status === 'Cancelled' || !order.total ? "N/A" : `$${order.total}`}</TableCell>
                                                        <TableCell align="right">
                                                            <Button 
                                                                data-viewid={order.id}
                                                                variant="contained"
                                                                size="small"
                                                                onClick={handleViewButtonClick}
                                                            >
                                                                View
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    }
                            </Table>
                        {
                                ordersTotal - ordersEndIndex > 0 &&
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            mt: 1,
                                            mb: 1,
                                            background: '#768087',
                                            ":hover": {
                                            bgcolor: "#5e666c",
                                            color: "white" }
                                        }}
                                        onClick={handleShowMoreButtonClick}
                                    >
                                        Show More
                                    </Button>
                        }
                    </>
                }
                </Paper>
            </Grid>
        </Grid>
    )
}

export default AdminOrders;