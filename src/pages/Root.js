import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import ButtonAppBar from "../components/AppBar";
import Container from "@mui/material/Container";

export default function Root() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [adminToken, setAdminToken] = useState(localStorage.getItem('token'));
    const navigate = useNavigate();
    const location = useLocation();
    const page = location.pathname;

    useEffect(() => {    
        if (page === "/") {
            navigate("/home");
        }
    }, []);

    return (
        <>
            <ButtonAppBar
                token={token}
                setToken={setToken}
                adminToken={adminToken}
                setAdminToken={setAdminToken}
            />
            <Container sx={{ marginY: 5 }}>
                <section className="logo">
                    <h1>Puppy Paradise</h1>
                </section>
                <Outlet context={[token, setToken, adminToken, setAdminToken]}/>
            </Container>
        </> 
    );
}