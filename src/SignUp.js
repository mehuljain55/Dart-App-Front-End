import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [candidateName, setCandidateName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signupMessage, setSignupMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const userData = { candidateName, email, password };

        fetch('http://localhost:8080/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then(data => {
            setSignupMessage(`Signup successful! Your Candidate ID is ${data.candidateId}.`);
        })
        .catch(error => {
            console.error('Error signing up:', error);
            setSignupMessage('Error signing up. Please try again.');
        });
    };

    return (
        <div style={{ background: 'linear-gradient(to right, rgba(255, 255, 255, 0.4), rgba(0, 0, 0, 0.8))', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={10} style={{ padding: 20, width: 300, backdropFilter: 'blur(5px)', backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
                <Container>
                    <Typography variant="h4" style={{ marginBottom: 20 }}>Sign Up</Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={candidateName}
                            onChange={e => setCandidateName(e.target.value)}
                            placeholder="Enter Name"
                        />
                        <TextField
                            type="email"
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Enter Email"
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
                        <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>Submit</Button>
                    </form>
                    {signupMessage && <Typography variant="subtitle1" style={{ marginTop: 20 }}>{signupMessage}</Typography>}
                </Container>
            </Paper>
        </div>
    );
};

export default SignUp;
