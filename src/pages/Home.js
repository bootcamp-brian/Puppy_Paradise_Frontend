import PuppyCard from "../components/PuppyCard";
import Grid from "@mui/material/Grid";

const Home = () => {
    return <div className="page">
        <Grid container spacing={2}>
            <PuppyCard imgURL="https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/59938051/1/?bust=1677693052&width=1080"/>
            <PuppyCard imgURL="https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/59405844/1/?bust=1673387710&width=1080"/>
            <PuppyCard />
            <PuppyCard />
            <PuppyCard />
        </Grid>
    </div>
}

export default Home;