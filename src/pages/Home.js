import PuppyCard from "../components/PuppyCard";
import { useEffect, useState } from "react";
import { createGuestOrder, createOrder, getAvailablePuppies, getCart, getPuppiesByCategory, getPuppyCategories, getStripeCheckout } from "../utils/API";
import { useOutletContext } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from "@mui/system";
import FeaturedDetails from "../components/FeaturedDetails";
import Loading from "../components/Loading";
import { Box, Button, Autocomplete, TextField, Grid } from "@mui/material";

const Home = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [puppies, setPuppies] = useState([]);
    const [featuredPuppy, setFeaturedPuppy] = useState({});
    const [puppiesStartIndex, setPuppiesStartIndex] = useState(0);
    const [puppiesEndIndex, setPuppiesEndIndex] = useState(9);
    const [puppiesTotal, setPuppiesTotal] = useState(0)
    const [token, setToken, adminToken, setAdminToken, cartItems, setCartItems, checkoutId, setCheckoutId] = useOutletContext();
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const handleCategorySelect = (event, newValue) => {
        setPuppiesStartIndex(0);
        setPuppiesEndIndex(9);
        setSelectedCategories(newValue);
    }

    const handlePrevButtonClick = (event) => {
        setIsLoading(true);
        setPuppiesStartIndex(puppiesStartIndex - 9);
        setPuppiesEndIndex(puppiesEndIndex - 9);
        setIsLoading(false);
    }

    const handleNextButtonClick = (event) => {
        setIsLoading(true);
        setPuppiesStartIndex(puppiesStartIndex + 9);
        setPuppiesEndIndex(puppiesEndIndex + 9);
        setIsLoading(false);
    }
    
    const theme = createTheme();
    
    const renderStoreFront = async () => {
        setIsLoading(true);
        if (token) {
            if (checkoutId) {
                const checkoutSession = await getStripeCheckout(checkoutId);
                const date = new Date();
                const timestamp = date.toISOString();
                if (checkoutSession.session.payment_status === "paid") {
                        localStorage.removeItem('checkoutId');
                        setCheckoutId('');
                        const newOrder = await createOrder(token, timestamp);
                        console.log(newOrder);
                }
            }
            const userCart = await getCart(token);
            setCartItems(userCart.cartItems)
        } else {
            console.log(checkoutId)
            if (checkoutId) {
                const checkoutSession = await getStripeCheckout(checkoutId);
                const date = new Date();
                const timestamp = date.toISOString();
                if (checkoutSession.session.payment_status === "paid") {
                        localStorage.removeItem('checkoutId');
                        setCheckoutId('');
                        const newOrder = await createGuestOrder(cartItems, timestamp);
                        console.log(newOrder);
                        localStorage.removeItem('cartItems');
                        setCartItems([]);
                    }
            }
        }

        const allAvailablePuppies = await getAvailablePuppies();
        const categoriesData = await getPuppyCategories();

        setAllCategories(categoriesData);

        if(Object.keys(selectedCategories).length !== 0) {
            let filteringArr = [ ...allAvailablePuppies ];

            for (let category of selectedCategories) {
                const categoryPuppies = await getPuppiesByCategory(Number(category.id));
                const categoryPuppiesMap = {};

                for (let puppy of categoryPuppies) {
                    categoryPuppiesMap[puppy.id] = puppy;
                }

                const filteredPuppies = filteringArr.filter(puppy => {
                    if (categoryPuppiesMap[puppy.id]) {
                        return true;
                    }
                })

                filteringArr = filteredPuppies;
            }

            const puppiesToShow = [ ...filteringArr ];

            setPuppiesTotal(puppiesToShow.length);
            setPuppies(puppiesToShow.slice(puppiesStartIndex, puppiesEndIndex));
        } else {
            setPuppiesTotal(allAvailablePuppies.length)
            setPuppies(allAvailablePuppies.slice(puppiesStartIndex, puppiesEndIndex));
        }
        setIsLoading(false);
    }

    useEffect(() => {
        renderStoreFront();
    }, [puppiesStartIndex, puppiesEndIndex, selectedCategories])

    return (<>
        {
            isLoading && <Loading />
        }
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xl">
                {
                    Object.keys(featuredPuppy).length === 0 &&
                    <Autocomplete
                        multiple
                        id="category-select"
                        options={allCategories}
                        getOptionLabel={(option) => option.name}
                        value={selectedCategories}
                        onChange={handleCategorySelect}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        sx={{ mb: 2 }}
                        renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Sorting Categories"
                            placeholder="Categories"
                        />
                        )}
                    />
                }
                <Grid container spacing={2} sx={{ display: 'flex', alignItems: 'end' }}>
                    {
                        Object.keys(featuredPuppy).length === 0
                        ?
                        puppies.map(puppy => {
                            const { id, image1, name, age, size, price, breed } = puppy;
                            let inCart = false;
                            for (let item of cartItems) {
                                if ((token ? item.puppyId : item.id) === puppy.id) {
                                    inCart = true;
                                    break;
                                }
                            }
                            
                            return <PuppyCard
                                key={id}
                                id={id}
                                imgURL={image1}
                                name={name}
                                age={age}
                                size={size}
                                price={price}
                                breed={breed}
                                setFeaturedPuppy={setFeaturedPuppy}
                                setIsLoading={setIsLoading}
                                token={token}
                                cartItems={cartItems}
                                setCartItems={setCartItems}
                                inCart={inCart}
                            />
                        })
                        :
                        <FeaturedDetails
                            featuredPuppy={featuredPuppy}
                            setFeaturedPuppy={setFeaturedPuppy}
                            setIsLoading={setIsLoading}
                            token={token}
                            cartItems={cartItems}
                            setCartItems={setCartItems}
                        />
                    }
                </Grid>
                <Box
                    sx={{
                        display: 'flex',
                        mt: 2,
                        justifyContent: 
                            puppiesStartIndex === 0 ? 'end' :
                                (puppiesEndIndex >= puppiesTotal ? 'start'
                                :
                                'space-between')
                    }}
                >
                {
                        puppiesStartIndex !== 0 && Object.keys(featuredPuppy).length === 0 &&
                            <Button
                                variant="contained"
                                size="medium"
                                color="primary"
                                onClick={handlePrevButtonClick}
                                sx={{
                                    mt: 1,
                                    mb: 1,
                                    background: '#768087',
                                    ":hover": {
                                    bgcolor: "#5e666c",
                                    color: "white" }
                                }}
                            >
                                {'<<'} Prev
                            </Button>
                }
                {
                        puppiesTotal - puppiesEndIndex > 0 && Object.keys(featuredPuppy).length === 0 &&
                            <Button
                                variant="contained"
                                size="medium"
                                color="primary"
                                onClick={handleNextButtonClick}
                                sx={{
                                    mt: 1,
                                    mb: 1,
                                    background: '#768087',
                                    ":hover": {
                                    bgcolor: "#5e666c",
                                    color: "white" }
                                }}
                            >
                                Next {'>>'}
                            </Button>
                }
                </Box>
            </Container>
        </ThemeProvider>
    </>)
}

export default Home;