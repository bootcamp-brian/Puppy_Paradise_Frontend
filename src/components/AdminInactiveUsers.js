import * as React from 'react';
import { useState, useEffect } from "react";
import Title from './Title';
import { 
        Table, 
        TableHead, 
        TableBody, 
        TableRow, 
        TableCell, 
        Paper, 
        Grid, 
        Typography, 
        Button
    } from '@mui/material';
import { 
    adminGetUserById,
        adminReactivateUser,
    } from '../utils/API';

const AdminInactiveUsers = ({ adminToken, setIsLoading, setFeaturedUser, inactiveUsers }) => {
    const [users, setUsers] = useState([]);
    const [usersEndIndex, setUsersEndIndex] = useState(5);
    const [usersTotal, setUsersTotal] = useState(0)
    const [sortMethod, setSortMethod] = useState('userId');
    const [sortMethodDescending, setSortMethodDescending] = useState(false);
            // eslint-disable-next-line
    const [responseMessage, setResponseMessage] = useState('');
    
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

    const handleReactivateButtonClick = async (event) => {
        setIsLoading(true);
        const userId = event.target.getAttribute('data-reactivateid');
        const reactivatedUser = await adminReactivateUser(adminToken, userId)
        const newUser = await adminGetUserById(adminToken, reactivatedUser.userId)
        setFeaturedUser(newUser)
        setIsLoading(false);
    }

    const renderAdminInactiveUsers = async () => {
        setIsLoading(true);
        setUsersTotal(inactiveUsers.length);
        const usersToShow = inactiveUsers.slice(0, usersEndIndex);

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
        renderAdminInactiveUsers();
    }, [inactiveUsers, usersEndIndex, sortMethod, sortMethodDescending, responseMessage]);
    
    return (
        <Grid container spacing={3}>
            {/* Inactive Users List */}
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
                            No inactive users to show
                        </Typography>
                        :
                        <>
                            <Title>Inactive Users</Title>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>                                       
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
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                    {
                                        <TableBody>
                                            {
                                                users.map((user) => (
                                                    <TableRow key={user.id}>
                                                        <TableCell>{user.firstName}</TableCell>
                                                        <TableCell>{user.lastName}</TableCell>
                                                        <TableCell>{user.email}</TableCell>
                                                        <TableCell align="right">
                                                        <Button 
                                                            data-reactivateid={user.id}
                                                            variant="contained"
                                                            size="small"
                                                            sx= {{
                                                                m: 1, 
                                                                p: 1,
                                                                background: 'green',
                                                                ":hover": {
                                                                    bgcolor: "#106B21",
                                                                    color: "white" }
                                                            }}
                                                            onClick={handleReactivateButtonClick}
                                                        >
                                                            Reactivate
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
        </Grid>
    )
}

export default AdminInactiveUsers;