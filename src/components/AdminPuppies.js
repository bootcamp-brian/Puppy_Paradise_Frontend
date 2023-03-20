import * as React from 'react';
import { Paper, Grid, Table, TableHead, TableCell, TableRow, TableBody, Button, Typography, Zoom } from "@mui/material";
import { useState, useEffect } from 'react';
import { getPuppyById, adminGetAllPuppies } from '../utils/API';
import Title from './Title';
import PuppyForm from './PuppyForm';
import CategoryForm from './CategoryForm';

const AdminPuppies = ({ adminToken, setIsLoading }) => {
    const [puppies, setPuppies] = useState([]);
    const [puppiesEndIndex, setPuppiesEndIndex] = useState(5);
    const [puppiesTotal, setPuppiesTotal] = useState(0)
    const [sortMethod, setSortMethod] = useState('puppyId');
    const [sortMethodDescending, setSortMethodDescending] = useState(false);
    const [featuredPuppy, setFeaturedPuppy] = useState({})
    const [formMode, setFormMode] = useState('create');
    const [zoom, setZoom] = useState(true);
    const [responseMessage, setResponseMessage] = useState('');
    const [allCategories, setAllCategories] = useState([]);

    const handleShowMoreButtonClick = () => {
        setIsLoading(true);
        setPuppiesEndIndex(puppiesEndIndex + 5);
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

    const handleEditButtonClick = async (event) => {
        setIsLoading(true);
        setZoom(false);
        const puppyId = event.target.getAttribute('data-editid');
        const newFeaturedPuppy = await getPuppyById(puppyId);
        setFeaturedPuppy(newFeaturedPuppy);
        setFormMode('edit');
        setZoom(true);
        setIsLoading(false);
    }

    const renderAdminPuppies = async () => {
        setIsLoading(true);
        const allPuppies = await adminGetAllPuppies(adminToken);
        
        allPuppies.sort((a, b) => {
            return Number(a.id) - Number(b.id);
        })

        if (Object.keys(featuredPuppy).length === 0) {
            setFeaturedPuppy(allPuppies[0]);
        } else {
            const newFeaturedPuppy = await getPuppyById(featuredPuppy.id);
            setFeaturedPuppy(newFeaturedPuppy);
        }

        setPuppiesTotal(allPuppies.length);
        const puppiesToShow = allPuppies.slice(0, puppiesEndIndex);

        if (sortMethod === 'puppyId') {
            if (sortMethodDescending) {
                puppiesToShow.sort((a, b) => {
                    return Number(b.id) - Number(a.id);
                })
            } else {
                puppiesToShow.sort((a, b) => {
                    return Number(a.id) - Number(b.id);
                })
            }
        } else if (sortMethod === 'name') {
            if (sortMethodDescending) {
                puppiesToShow.sort((a, b) => {
                    if (b.name < a.name) {
                        return -1;
                    }
                    if (b.name > a.name) {
                        return 1;
                    }
                    return 0;
                })
            } else {
                puppiesToShow.sort((a, b) => {
                    if (b.name > a.name) {
                        return -1;
                    }
                    if (b.name < a.name) {
                        return 1;
                    }
                    return 0;
                })
            }
        } else if (sortMethod === 'available') {
            if (sortMethodDescending) {
                puppiesToShow.sort((a, b) => {
                    if (b.isAvailable < a.isAvailable) {
                        return -1;
                    }
                    if (b.isAvailable > a.isAvailable) {
                        return 1;
                    }
                    return 0;
                })
            } else {
                puppiesToShow.sort((a, b) => {
                    if (b.isAvailable > a.isAvailable) {
                        return -1;
                    }
                    if (b.isAvailable < a.isAvailable) {
                        return 1;
                    }
                    return 0;
                })
            }
        } else if (sortMethod === 'price') {
            if (sortMethodDescending) {
                puppiesToShow.sort((a, b) => {
                    return b.price - a.price;
                })
            } else {
                puppiesToShow.sort((a, b) => {
                    return a.price - b.price;
                })
            }
        } 

        setPuppies(puppiesToShow);
        setIsLoading(false);
    }

    useEffect(() => {
        renderAdminPuppies();
    }, [puppiesEndIndex, sortMethod, sortMethodDescending, responseMessage]);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Zoom in={zoom} style={{ transitionDelay: zoom ? '500ms' : '0ms' }}>
                    <Paper
                        sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        }}
                    >
                        <PuppyForm
                            featuredPuppy={featuredPuppy}
                            adminToken={adminToken}
                            formMode={formMode}
                            setFormMode={setFormMode}
                            setZoom={setZoom}
                            responseMessage={responseMessage}
                            setResponseMessage={setResponseMessage}
                            setIsLoading={setIsLoading}
                            allCategories={allCategories}
                            setAllCategories={setAllCategories}
                        />
                    </Paper>
                </Zoom>
            </Grid>
            <Grid item xs={12}>
                <Paper
                    sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column'
                    }}
                >
                    <CategoryForm
                        adminToken={adminToken}
                        allCategories={allCategories}
                        setAllCategories={setAllCategories}
                        setIsLoading={setIsLoading}
                    />
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    {
                        puppies.length === 0
                        ?
                        <Typography variant="subtitle" component="h3" >
                            No puppies to show
                        </Typography>
                        :
                        <>
                            <Title>Puppies List</Title>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            data-header='puppyId'
                                            title={`Sort ${sortMethodDescending ? 'ascending' : 'descending'}`}
                                            sx={{
                                                ":hover": {
                                                cursor: 'pointer',
                                                background: 'lightgray'
                                            }}}
                                            onClick={handleHeaderClick}
                                        >
                                            Puppy I.D.
                                        </TableCell>
                                        <TableCell
                                            data-header='name'
                                            title={`Sort ${sortMethodDescending ? 'ascending' : 'descending'}`}
                                            sx={{
                                                ":hover": {
                                                cursor: 'pointer',
                                                background: 'lightgray'
                                            }}}
                                            onClick={handleHeaderClick}
                                        >
                                            Name
                                        </TableCell>
                                        <TableCell
                                            data-header='available'
                                            title={`Sort ${sortMethodDescending ? 'ascending' : 'descending'}`}
                                            sx={{
                                                ":hover": {
                                                cursor: 'pointer',
                                                background: 'lightgray'
                                            }}}
                                            onClick={handleHeaderClick}
                                        >
                                            Available
                                        </TableCell>
                                        <TableCell
                                            data-header='price'
                                            title={`Sort ${sortMethodDescending ? 'ascending' : 'descending'}`}
                                            sx={{
                                                ":hover": {
                                                cursor: 'pointer',
                                                background: 'lightgray'
                                            }}}
                                            onClick={handleHeaderClick}
                                        >
                                            Price
                                        </TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                    {
                                        <TableBody>
                                            {
                                                puppies.map((puppy) => (
                                                    <TableRow key={puppy.id}>
                                                        <TableCell >{puppy.id}</TableCell>
                                                        <TableCell>{puppy.name}</TableCell>
                                                        <TableCell>{puppy.isAvailable ? 'Yes' : 'No'}</TableCell>
                                                        <TableCell>{puppy.price ? `$${puppy.price}` : '$0.00'}</TableCell>
                                                        <TableCell align="right">
                                                            <Button 
                                                                data-editid={puppy.id}
                                                                variant="contained"
                                                                size="small"
                                                                onClick={handleEditButtonClick}
                                                            >
                                                                Edit
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    }
                            </Table>
                        {
                                puppiesTotal - puppiesEndIndex > 0 &&
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            mt: 2,
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

export default AdminPuppies;