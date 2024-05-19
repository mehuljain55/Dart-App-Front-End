import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import './NavBar.css';


const NavBar = ({ candidateId, onLogout }) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Questionnaire
                </Typography>
                <Typography variant="body1" sx={{ marginRight: '20px' }}>
                    Student ID: {candidateId}
                </Typography>
                <Button style={{color: "red"}}  onClick={onLogout}>Logout</Button>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
