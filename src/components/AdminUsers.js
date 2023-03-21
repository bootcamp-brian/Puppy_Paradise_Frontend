import * as React from 'react';
import { useState, useEffect } from "react";
import Title from './Title';
import AdminEditUserInfo from './AdminEditUserInfo';
import AdminInactiveUsers from './AdminInactiveUsers';
import { 
        Table, 
        TableHead, 
        TableBody, 
        TableRow, 
        TableCell, 
        Paper, 
        Grid, 
        Typography, 
        Button,
        Box,
        Zoom,
    } from '@mui/material';
import { 
        adminGetUserById, 
        adminGetAllUsers,
        adminDeleteUser,  
        adminPromoteToAdmin, 
        adminGetInactiveUsers,
        adminGetAllAdmins,
        adminGetAllResetUsers, 
    } from '../utils/API';

const AdminUsers = ({ adminToken, setIsLoading }) => {
    const [users, setUsers] = useState([]);
    const [inactiveUsers, setInactiveUsers] = useState([]);
    const [featuredUser, setFeaturedUser] = useState({});
                // eslint-disable-next-line
    const [shippingAddress, setShippingAddress] = useState({});
                // eslint-disable-next-line
    const [billingAddress, setBillingAddress] = useState({});
    const [usersEndIndex, setUsersEndIndex] = useState(5);
    const [usersTotal, setUsersTotal] = useState(0);
    const [sortMethod, setSortMethod] = useState('userId');
    const [sortMethodDescending, setSortMethodDescending] = useState(false);
    const [zoom, setZoom] = useState(true);
                // eslint-disable-next-line
    const [responseMessage, setResponseMessage] = useState('');
    const [adminMap, setAdminMap] = useState({});
    const [passwordResetMap, setPasswordResetMap] = useState({});

    const handleShowMoreButtonClick = () => {
        setIsLoading(true);
        setUsersEndIndex(usersEndIndex + 5);
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
        const userId = event.target.getAttribute('data-viewid');
        const newFeaturedUser = await adminGetUserById(adminToken, userId);
        setFeaturedUser(newFeaturedUser);
        setShippingAddress(newFeaturedUser.shippingAddress);
        setBillingAddress(newFeaturedUser.billingAddress);
        setZoom(true);
        setIsLoading(false);
    }

    const handleDeleteButtonClick = async () => {
        setIsLoading(true);
        await adminDeleteUser(adminToken, featuredUser.id);
        setFeaturedUser({})
        setIsLoading(false);
    }

    const handleAdminButtonClick = async () => {
        setIsLoading(true);
        await adminPromoteToAdmin(adminToken, featuredUser.id);
        setFeaturedUser({})
        setIsLoading(false);
    }

    const renderAdminUsers = async () => {
        setIsLoading(true);
        const admins = await adminGetAllAdmins(adminToken);
        const resetPasswordUsers = await adminGetAllResetUsers(adminToken);
        const userAdmins = {};
        const passwordResetUsers = {};

        for (let admin of admins) {
            userAdmins[admin.userId] = true
        }

        for (let resetPasswordUser of resetPasswordUsers) {
            passwordResetUsers[resetPasswordUser.userId] = true
        }

        setAdminMap(userAdmins);
        setPasswordResetMap(passwordResetUsers);

        const allUsers = await adminGetAllUsers(adminToken);
        allUsers.shift();
        const inactiveUsersArr = []
        const inactiveUsersRefs = await adminGetInactiveUsers(adminToken)
        const activeUsers = allUsers.filter(user => {
            for (let inactiveUser of inactiveUsersRefs) {
                if (inactiveUser.userId === user.id) {
                    inactiveUsersArr.push(user);
                    return false;
                } 
            }
            return true;
        })
        setUsersTotal(activeUsers.length)
        setInactiveUsers(inactiveUsersArr)
        const usersToShow = activeUsers.slice(0, usersEndIndex);

        if (sortMethod === 'userId') {
            if (sortMethodDescending) {
                usersToShow.sort((a, b) => {
                    return Number(b.id) - Number(a.id);
                })
            } else {
                usersToShow.sort((a, b) => {
                    return Number(a.id) - Number(b.id);
                })
            }
        } else if (sortMethod === 'firstName') {
            if (sortMethodDescending) {
                usersToShow.sort((a, b) => {
                    if (b.firstName < a.firstName) {
                        return -1;
                    }
                    if (b.firstName > a.firstName) {
                        return 1;
                    }
                    return 0;
                })
            } else {
                usersToShow.sort((a, b) => {
                    if (b.firstName > a.firstName) {
                        return -1;
                    }
                    if (b.firstName < a.firstName) {
                        return 1;
                    }
                    return 0;
                })
            }
        } else if (sortMethod === 'lastName') {
            if (sortMethodDescending) {
                usersToShow.sort((a, b) => {
                    if (b.lastName < a.lastName) {
                        return -1;
                    }
                    if (b.lastName > a.lastName) {
                        return 1;
                    }
                    return 0;
                })
            } else {
                usersToShow.sort((a, b) => {
                    if (b.lastName > a.lastName) {
                        return -1;
                    }
                    if (b.lastName < a.lastName) {
                        return 1;
                    }
                    return 0;
                })
            }
        } else if (sortMethod === 'email') {
            if (sortMethodDescending) {
                usersToShow.sort((a, b) => {
                    if (b.email < a.email) {
                        return -1;
                    }
                    if (b.email > a.email) {
                        return 1;
                    }
                    return 0;
                })
            } else {
                usersToShow.sort((a, b) => {
                    if (b.email > a.email) {
                        return -1;
                    }
                    if (b.email < a.email) {
                        return 1;
                    }
                    return 0;
                })
            }
        } 

        setUsers(usersToShow);
        setIsLoading(false);
    }
    
    useEffect(() => {
        renderAdminUsers();
    }, [featuredUser, usersEndIndex, sortMethod, sortMethodDescending, responseMessage]);
    
    return (
        <Grid container spacing={3}>
            {/* Featured User */}
            <Grid item xs={12}>
                <Zoom in={zoom} style={{ transitionDelay: zoom ? '500ms' : '0ms' }}>
                    <Paper
                        sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column'
                        }}
                    >
                        {
                            Object.keys(featuredUser).length === 0
                            ?
                            <Typography variant="h5" component="h2" sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                pb: 1,
                                mb: 1
                            }}>
                                Select a user to view details.
                            </Typography>
                            :
                            <>
                                <Typography variant="h4" component="h2" sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    pb: 1,
                                    borderBottom: '1px solid black',
                                    mb: 1
                                }}>
                                    User Details
                                </Typography>
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
                                            <Typography component="p" variant="h5"> {featuredUser.firstName} {featuredUser.lastName} </Typography>
                                            <Typography color="text.secondary" sx={{ flex: 1 }}> {featuredUser.email} </Typography>
                                            <Typography> {featuredUser.phone} </Typography>
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
                                            <Typography> {Object.keys(featuredUser).length !== 0 ? featuredUser.shippingAddress.address : ''} </Typography>
                                            <Typography> {Object.keys(featuredUser).length !== 0 ? featuredUser.shippingAddress.city : ''}, {Object.keys(featuredUser).length !== 0 ? featuredUser.shippingAddress.state : ''} {Object.keys(featuredUser).length !== 0 ? featuredUser.shippingAddress.zip : ''} </Typography>
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
                                            <Typography> {Object.keys(featuredUser).length !== 0 ? featuredUser.billingAddress.address : ''} </Typography>
                                            <Typography> {Object.keys(featuredUser).length !== 0 ? featuredUser.billingAddress.city : ''}, {Object.keys(featuredUser).length !== 0 ? featuredUser.billingAddress.state : ''} {Object.keys(featuredUser).length !== 0 ? featuredUser.billingAddress.zip : ''} </Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                                <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                    <Button 
                                        data-editid={featuredUser.id}
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            m: 1, 
                                            p: 1
                                        }}
                                        onClick={handleAdminButtonClick}
                                    >
                                        Promote to Admin
                                    </Button>
                                    <AdminEditUserInfo 
                                        adminToken={adminToken}
                                        setFeaturedUser={setFeaturedUser}
                                        featuredUser={featuredUser}
                                        setIsLoading={setIsLoading}
                                    />
                                    
                                    <Button 
                                        data-editid={featuredUser.id}
                                        color="error"
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            m: 1, 
                                            p: 1
                                        }}
                                        onClick={handleDeleteButtonClick}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </>
                        }
                    </Paper>
                </Zoom>
            </Grid>
            {/* Users List */}
            <Grid item xs={12}>
                <Paper sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    {
                        users.length === 0
                        ?
                        <Typography variant="subtitle" component="h3" >
                            No users to show
                        </Typography>
                        :
                        <>
                            <Title>Active Users</Title>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
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
                                            User ID
                                        </TableCell>
                                        <TableCell
                                            data-header='firstName'
                                            title={`Sort ${sortMethodDescending ? 'ascending' : 'descending'}`}
                                            sx={{
                                                ":hover": {
                                                cursor: 'pointer',
                                                background: 'lightgray'
                                            }}}
                                            onClick={handleHeaderClick}
                                        >
                                            First
                                        </TableCell>   
                                        <TableCell
                                            data-header='lastName'
                                            title={`Sort ${sortMethodDescending ? 'ascending' : 'descending'}`}
                                            sx={{
                                                ":hover": {
                                                cursor: 'pointer',
                                                background: 'lightgray'
                                            }}}
                                            onClick={handleHeaderClick}
                                        >
                                            Last
                                        </TableCell>
                                        <TableCell
                                            data-header='email'
                                            title={`Sort ${sortMethodDescending ? 'ascending' : 'descending'}`}
                                            sx={{
                                                ":hover": {
                                                cursor: 'pointer',
                                                background: 'lightgray'
                                            }}}
                                            onClick={handleHeaderClick}
                                        >
                                            Email
                                        </TableCell>
                                        <TableCell
                                            data-header='admin'
                                            title={`Sort ${sortMethodDescending ? 'ascending' : 'descending'}`}
                                            sx={{
                                                ":hover": {
                                                cursor: 'pointer',
                                                background: 'lightgray'
                                            }}}
                                            onClick={handleHeaderClick}
                                        >
                                            Admin
                                        </TableCell>
                                        <TableCell
                                            data-header='needsReset'
                                            title={`Sort ${sortMethodDescending ? 'ascending' : 'descending'}`}
                                            sx={{
                                                ":hover": {
                                                cursor: 'pointer',
                                                background: 'lightgray'
                                            }}}
                                            onClick={handleHeaderClick}
                                        >
                                            Needs Reset
                                        </TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                    {
                                        <TableBody>
                                            {
                                                users.map((user) => (
                                                    <TableRow key={user.id}>
                                                        <TableCell >{user.id}</TableCell>
                                                        <TableCell>{user.firstName}</TableCell>
                                                        <TableCell>{user.lastName}</TableCell>
                                                        <TableCell>{user.email}</TableCell>
                                                        <TableCell>{adminMap[user.id] ? 'Yes': 'No'}</TableCell>
                                                        <TableCell>{passwordResetMap[user.id] ? 'Yes': 'No'}</TableCell>
                                                        <TableCell align="right">
                                                        
                                                            <Button 
                                                                data-viewid={user.id}
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
                            usersTotal - usersEndIndex > 0 &&
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
            {/* Inactive Users */}
            <Grid item xs={12}>
                <Paper sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                <AdminInactiveUsers 
                    adminToken={adminToken}
                    user={featuredUser}
                    setFeaturedUser={setFeaturedUser}
                    setIsLoading={setIsLoading}
                    inactiveUsers={inactiveUsers}
                />                
                </Paper>
            </Grid>
        </Grid>
    )
}

export default AdminUsers;

//promote a user to admin
//make a user reset password

