import React, { useState } from 'react';
import FormattedText from './FormattedText'; // Assuming you have a FormattedText component
import { Grid, TextField, Button, Typography, Paper, Container, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ResultPage = () => {
    const [candidateId, setCandidateId] = useState('');
    const [candidateDetails, setCandidateDetails] = useState(null);
    const [answers, setAnswers] = useState([]);
  



    const fetchCandidateAnswers = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/show?candidateId=${id}`);
            const data = await response.json();
            setCandidateDetails({
                candidateName: data.candidateName,
                candidateId: data.candidateId,
                email: data.email,
                password: data.password
            });
            setAnswers(data.answerDatasets);
        } catch (error) {
            console.error('Error fetching candidate answers:', error);
        }
    };

    

    const handleCheck = () => {
        if (candidateId.trim()) {
            fetchCandidateAnswers(candidateId);
        } else {
            alert('Please enter a valid Candidate ID.');
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Candidate Result Portal
            </Typography>
            <Typography variant="h6" gutterBottom>
                Enter Candidate ID
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Candidate ID"
                        variant="outlined"
                        value={candidateId}
                        onChange={(e) => setCandidateId(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleCheck}
                    >
                        Check
                    </Button>
                </Grid>
            </Grid>
            {candidateDetails && (
                <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
                    <Typography variant="h6">Candidate Details</Typography>
                    <Typography><strong>Candidate Name:</strong> {candidateDetails.candidateName}</Typography>
                    <Typography><strong>Candidate ID:</strong> {candidateDetails.candidateId}</Typography>
                    <Typography><strong>Email:</strong> {candidateDetails.email}</Typography>
                </Paper>
            )}
            {answers.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                    <Typography variant="h6">Candidate Answers</Typography>
                    {answers.map((answer, index) => (
                        <Accordion key={index}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="subtitle1">Question {answer.questionId}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div style={{ width: '100%' }}>
                                    <Typography variant="body1">
                                        <strong>Question: {answer.question_info} </strong>
                                    </Typography>
                                    <FormattedText content={answer.answerTranscript} />
                                    {answer.videoPath && (
                                        <video controls style={{ width: '200px', height: '200px', marginTop: '8px' }}>
                                            <source src={answer.videoPath} type="video/webm" />
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            )}
        </Container>
    );
};

export default ResultPage;