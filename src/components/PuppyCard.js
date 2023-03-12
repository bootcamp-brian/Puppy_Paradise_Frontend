import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";

const PuppyCard = ({ imgURL, name, description, price, breed }) => {
    return <Grid item xs={4}>
        <Paper elevation={24}>
            <img
                src={imgURL}
                alt=""
                className="img"
            />
            <Box paddingX={2}>
                <Typography variant="subtitle1" component="h2">
                    Puppy Name
                </Typography>        
                <Typography variant="body1" component="p">
                    Puppy Description that is long enough to go to the next line
                </Typography>
            </Box>      
        </Paper>
    </Grid>
}

export default PuppyCard;