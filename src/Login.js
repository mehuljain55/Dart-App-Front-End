import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Paper } from '@mui/material';

const Login = () => {
    const [candidateId, setCandidateId] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const candidateIdParam = urlParams.get('candidateId');
        const messageParam = urlParams.get('message');

        if (candidateIdParam) {
            setCandidateId(candidateIdParam);
        }

        if (messageParam) {
            setMessage(messageParam);
        }
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        fetch('http://localhost:8080/validatelogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ candidateId, password }),
        })
        .then(response => response.json())
        .then(response => {
            if (response) {
                navigate(`/dashboard?candidateId=${candidateId}`);
            } else {
                alert('Login failed. Please check your credentials.');
            }
        })
        .catch(error => console.error('Error during login:', error));
    };

    const handleResultButtonClick = () => {
        navigate('/result');
    };

    return (
        <div style={{ background: 'linear-gradient(to right, rgba(255, 255, 255, 0.4), rgba(0, 0, 0, 0.8))', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={10} style={{ padding: 20, width: 300, backdropFilter: 'blur(5px)', backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
                <Container>
                    <Typography variant="h4" style={{ marginBottom: 20 }}>Login</Typography>
                    {message && <Typography variant="subtitle1" style={{ color: 'green', marginBottom: 20 }}>{message}</Typography>}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Candidate ID"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={candidateId}
                            onChange={e => setCandidateId(e.target.value)}
                            placeholder="Enter Candidate ID"
                        />
                        <TextField
                            type="password"
                            label="Password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter Password"
                        />
                        <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>Login</Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            style={{ marginTop: 20, marginRight: 10 }}
                            onClick={handleResultButtonClick}
                        >
                            Result
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            style={{ marginTop: 20 }}
                            onClick={() => navigate('/signup')}
                        >
                            Sign Up
                        </Button>
                    </form>
                </Container>
            </Paper>
        </div>
    );
};

export default Login;
