import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import PetsIcon from '@mui/icons-material/Pets';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Button, CardActionArea, CardActions } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { addItemToCart, getCart, getPuppyById } from "../utils/API";

const FeaturedDetails = ({ featuredPuppy, setFeaturedPuppy, setIsLoading, token, cartItems, setCartItems }) => {
    const {
        id,
        image1,
        image2,
        name,
        age,
        size,
        price,
        breed,
        description,
        weight,
        pedigree,
        isVaccinated,
        isAltered,
        gender,

    } = featuredPuppy;
    const convertedAge = Math.floor(age/12);
    const ageText = age <= 12 ? (age === 1 ? `${age} month` : `${age} months`) : (convertedAge === 1 ? `${convertedAge} year`: `${convertedAge} years`);

    let inCart = false;
    for (let item of cartItems) {
        if (item.id === id) {
            inCart = true;
            break;
        }
    }

    const handleBackClick = async (event) => {
        setIsLoading(true);
        setFeaturedPuppy({});
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

    return <Grid item xs={12}>
        <Paper elevation={6} sx={{ border: '1px solid black', minWidth: '980px' }}>
            <CardActions sx={{ display: 'flex', justifyContent: 'space-between', position: 'relative', top: 25, height: 0, margin: 0, padding: 0 }}>
                <Button
                    variant="contained"
                    size="medium"
                    color="primary"
                    onClick={handleBackClick}
                    sx={{ ml: 1 }}
                >
                    Back
                </Button>
                <Button
                    data-cart={id}
                    variant="contained"
                    size="medium"
                    color="primary"
                    onClick={handleAddToCartButtonClick}
                    sx={{ mr: 1 }}
                    disabled={inCart}
                >
                    Add To Cart
                </Button>
            </CardActions>
            <Box sx={{ display: 'flex', borderBottom: '1px solid black' }}>
                <img
                    src={image1}
                    alt=""
                    className="featuredImages"
                />
                <img
                    src={image2 ? image2 : 'https://img.freepik.com/free-vector/cute-corgi-dog-eating-bone-cartoon_138676-2534.jpg?w=360'}
                    alt={image2 ? "" : "Placeholder image"}
                    className="featuredImages"
                />
            </Box>
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
                            <Typography variant="h2" component="h1" sx={{ fontWeight: "bold" }}>
                                {name}
                            </Typography>
                        </Box>
                        <PetsIcon />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Typography variant="h4" component="h2" sx={{ fontWeight: "bold", minWidth: '980px', textAlign: 'center', mt: 2 }}>
                        {breed} | {ageText} old | {gender} | Size {size}
                    </Typography>
                    <Typography variant="h6" component="p" sx={{ fontWeight: "bold", minWidth: '980px', textAlign: 'center', borderTop: '1px solid black', borderBottom: '1px solid black', mt: 2, p: 2 }}>   
                        {description}
                    </Typography>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: "bold", minWidth: '980px', textAlign: 'center', mt: 2 }}>
                        {weight} lbs |
                        Pedigree: {pedigree ? 'Yes' : 'No'} |
                        Vaccinated: {isVaccinated ? 'Yes' : 'No'} |
                        {gender === 'Female' ? ' Spayed:' : ' Neutered:'} {isAltered ? 'Yes' : 'No'}
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
                        <Typography variant="h4" component="h2" sx={{ mt: 1, fontWeight: "bold", display: 'flex', justifyContent: 'center', pb: 1, mt: 2}}>
                            Price: ${price}
                        </Typography>
                        <PetsIcon />
                </Box>
            </Box>      
        </Paper>
    </Grid>
}

export default FeaturedDetails;