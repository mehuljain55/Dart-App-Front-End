import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import ResultPage from './ResultPage';
import SignUp from './SignUp';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/result" element={<ResultPage />} /> {/* New route for the Result Page */}
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </Router>
    );
}

export default App;