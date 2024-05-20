import React, { useState, useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { Button, AppBar, Toolbar, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';


const Dashboard = () => {
    const [candidateId, setCandidateId] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [recordedVideos, setRecordedVideos] = useState([]);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordingActive, setRecordingActive] = useState(false);
    const [textAnswers, setTextAnswers] = useState({});
    const videoRefs = useRef([]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const candidateIdParam = urlParams.get('candidateId');
        if (candidateIdParam) {
            setCandidateId(candidateIdParam);
        }

        fetch('http://localhost:8080/getAllQuestion')
            .then(response => response.json())
            .then(data => setQuestions(data))
            .catch(error => console.error('Error fetching questions:', error));
    }, []);

    useEffect(() => {
        if (questions.length > 0) {
            questions.forEach((question, index) => {
                if (question.type === 'Text') {
                    videoRefs.current[index] = new Quill(`#editor-${index}`, {
                        theme: 'snow',
                        modules: {
                            toolbar: [
                                [{ 'header': [1, 2, false] }],
                                ['bold', 'italic', 'underline'],
                                [ { 'list': 'bullet' }]
                            ]
                        },
                    });
                    videoRefs.current[index].on('text-change', () => {
                        const delta = videoRefs.current[index].getContents();
                        setTextAnswers(prevAnswers => ({
                            ...prevAnswers,
                            [index]: JSON.stringify(delta)
                        }));
                    });
                }
            });
        }
    }, [questions]);

    const startRecording = (index) => {
        if (!recordingActive) {
            navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                .then(stream => {
                    const videoElement = videoRefs.current[index];
                    if (videoElement) {
                        videoElement.srcObject = stream;
                        videoElement.play();
                    }
                    const newMediaRecorder = new MediaRecorder(stream);
                    setMediaRecorder(newMediaRecorder);
                    const chunks = [];
                    newMediaRecorder.ondataavailable = (event) => {
                        chunks.push(event.data);
                    };
                    newMediaRecorder.onstop = () => {
                        const blob = new Blob(chunks, { type: 'video/webm' });
                        setRecordedVideos(prevVideos => {
                            const newVideos = [...prevVideos];
                            newVideos[index] = blob;
                            return newVideos;
                        });
                        setRecordingActive(false);
                    };
                    newMediaRecorder.start();
                    setRecordingActive(true);
                })
                .catch(error => console.error('Error accessing user media:', error));
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            const stream = mediaRecorder.stream;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            if (videoRefs.current[currentQuestionIndex]) {
                videoRefs.current[currentQuestionIndex].srcObject = null;
            }
        }
    };

    const handleUpload = (event) => {
        event.preventDefault();
        const videoUploadPromises = recordedVideos.map((videoBlob, index) => {
            if (videoBlob) {
                const formData = new FormData();
                formData.append('videoFile', videoBlob, `${candidateId}_${questions[index].question_id}.webm`);
                return fetch('http://localhost:8080/video/upload', {
                    method: 'POST',
                    body: formData,
                });
            }
            return Promise.resolve();
        });

        const textUploadPromises = questions.map((question, index) => {
            if (question.type === 'Text') {
                const answer = textAnswers[index] || '';
                const formData = new FormData();
                formData.append('candidateId', candidateId);
                formData.append('questionID', question.question_id);
                formData.append('answer', answer);
                return fetch('http://localhost:8080/post/answer', {
                    method: 'POST',
                    body: formData,
                });
            }
            return Promise.resolve();
        });

        Promise.all([...videoUploadPromises, ...textUploadPromises])
            .then(() => console.log('All videos and text answers uploaded successfully.'))
            .catch(error => console.error('Error uploading videos or text answers:', error));
    };

    const handleNext = () => {
        setCurrentQuestionIndex(prevIndex => Math.min(prevIndex + 1, questions.length - 1));
    };

    const handlePrevious = () => {
        setCurrentQuestionIndex(prevIndex => Math.max(prevIndex - 1, 0));
    };

    const handleLogout = () => {
        // Logic to handle logout, such as clearing session storage, redirecting to login page, etc.
    };

    // Define a custom styled button for the round start button
    const RoundButton = styled(Button)({
        borderRadius: '50%',
        width: '50px',
        height: '50px',
    });

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography component="div" style={{display:'flex',justifyContent:'spacebetween',width:'100%'}} >
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Dart development
                        </Typography>
                        <Typography variant="h6"  align='center ' style={{paddingRight: "600px"}}>
                            Student ID: {candidateId}
                        </Typography>
                        <Typography>
                            <Button color="inherit" style={{backgroundColor:'red' ,}}  onClick={() => handleLogout()}>
                                Logout
                            </Button>
                        </Typography>
                    </Typography>
                </Toolbar>
            </AppBar>

            <div className="container mt-5">
                <h2>Questionnaire</h2>
                <form onSubmit={handleUpload}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                {questions.map((question, index) => (
                                    <Grid key={index} item xs={12}>
                                        <div
                                            className="question-container"
                                            style={{ display: index === currentQuestionIndex ? 'block' : 'none' }}
                                        >
                                            <Typography variant="subtitle1">
                                                Question {question.question_id} ({question.type}): {question.questiion}
                                            </Typography>
                                            {question.type === 'Text' ? (
                                                <div id={`editor-${index}`} className="quill-editor"></div>
                                            ) : (
                                                <>
                                                    <video ref={el => videoRefs.current[index] = el} width="320" height="240" controls></video>
                                                    <RoundButton
                                                        variant="contained"
                                                        color={recordingActive ? 'error' : 'primary'}
                                                        onClick={() => {
                                                            if (!recordingActive) {
                                                                startRecording(index);
                                                            } else {
                                                                stopRecording();
                                                            }
                                                        }}
                                                    >
                                                        {recordingActive ? 'Stop' : 'Start'}
                                                    </RoundButton>
                                                </>
                                            )}
                                        </div>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container justifyContent="space-between">
                                <Grid item>
                                    <Button
                                        type="button"
                                        variant="contained"
                                        color="error"
                                        onClick={handlePrevious}
                                        disabled={currentQuestionIndex === 0}
                                    >
                                        Previous
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        type="button"
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNext}
                                        disabled={currentQuestionIndex === questions.length - 1}
                                    >
                                        Next
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        {currentQuestionIndex === questions.length - 1 && (
                            <Grid item xs={12}>x
                                <Button type="submit" variant="contained" color="primary" className="mt-3">
                                    submit
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                </form>
            </div>
        </>
    );
};

export default Dashboard;
