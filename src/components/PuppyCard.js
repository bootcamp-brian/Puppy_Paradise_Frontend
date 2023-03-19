import * as React from 'react';
import PetsIcon from '@mui/icons-material/Pets';
import { Button, CardActions, Typography, Box, Grid, Paper } from '@mui/material';
import { addItemToCart, getCart, getPuppyById } from "../utils/API";

const PuppyCard = ({ id, imgURL, name, age, size, price, breed, setFeaturedPuppy, setIsLoading, token, cartItems, setCartItems, inCart }) => {
    const convertedAge = Math.floor(age/12);
    const ageText = age <= 12 ? (age === 1 ? `${age} month` : `${age} months`) : (convertedAge === 1 ? `${convertedAge} year`: `${convertedAge} years`);

    const handleDetailsButtonClick = async (event) => {
        setIsLoading(true);
        const puppyId = Number(event.target.getAttribute('data-details'));
        const puppy = await getPuppyById(puppyId);
        setFeaturedPuppy(puppy);
        setIsLoading(false);                   
    }

    const handleAddToCartButtonClick = async (event) => {
        setIsLoading(true);
        const cartItemId = Number(event.target.getAttribute('data-cart'));
        if (token) {
            const cartItem = await addItemToCart(token, cartItemId);
            const userCart = await getCart(token);
            setCartItems(userCart.cartItems);
        } else {
            const guestCartItems = [ ...cartItems ]
            const cartItem = await getPuppyById(cartItemId);
            if (!guestCartItems.includes(cartItem)) {
                guestCartItems.push(cartItem);
            }
            const guestCartItemsString = JSON.stringify(guestCartItems)
            localStorage.setItem('cartItems', guestCartItemsString);
            setCartItems(guestCartItems);
        }
        setIsLoading(false);
    }

    return <Grid item xs={4}>
        <Paper elevation={6} sx={{ border: '1px solid black' }}>
            <CardActions sx={{ display: 'flex', justifyContent: 'space-between', position: 'relative', top: 375, height: 0, margin: 0, padding: 0 }}>
                <Button
                    data-details={id}
                    variant="contained"
                    size="medium"
                    color="primary"
                    onClick={handleDetailsButtonClick}
                    sx={{ ml: 1 }}
                >
                    View Details
                </Button>
                <Button
                    data-cart={id}
                    variant="contained"
                    size="medium"
                    onClick={handleAddToCartButtonClick}
                    sx={{
                        mr: 1,
                        background: 'green',
                        ":hover": {
                            bgcolor: "#106B21",
                            color: "white" },
                        "&.Mui-disabled": {
                            background: "gray",
                            color: "white",
                            opacity: 0.8
                        }
                    }}
                    disabled={inCart}
                >
                    {inCart ? 'In Cart' : 'Add To Cart'}
                </Button>
            </CardActions>
            <img
                src={imgURL}
                alt=""
                className="img"
            />
            <Box paddingX={2}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        pt: 1
                    }}
                    >
                        <PetsIcon />
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-around',
                                alignItems: 'end'
                            }}
                        >
                            <Typography variant="h4" component="h2" sx={{ fontWeight: "bold", pb: 1 }}>
                                {name.toUpperCase()}
                            </Typography>
                        </Box>
                        <PetsIcon />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottom: '1px solid black',
                        pb: 1
                    }}
                    >
                    <Typography variant="h6" component="h2" sx={{ textAlign: 'center', pt: 1, borderTop: '1px solid black', width: '100%' }}>   
                        {breed}
                    </Typography>
                    <Typography variant="h6" component="h2" sx={{ textAlign: 'center', pt: 1, display: 'flex', justifyContent: 'center', width: '100%' }}>   
                        {ageText} old
                    </Typography>
                    <Typography variant="h6" component="h2" sx={{ textAlign: 'center', pt: 1, display: 'flex', justifyContent: 'center', width: '100%' }}>   
                        Size: {size}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'end',
                        pb: 1
                    }}
                    >
                        <PetsIcon />
                        <Typography variant="h4" component="h2" sx={{ pt: 1, fontWeight: "bold", display: 'flex', justifyContent: 'center', pb: 1, color: 'green' }}>
                            ${price}
                        </Typography>
                        <PetsIcon />
                </Box>
            </Box>      
        </Paper>
    </Grid>
}

export default PuppyCard;