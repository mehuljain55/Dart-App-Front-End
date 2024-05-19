import React from 'react';
import { Link } from 'react-router-dom';

const NavigationComponent = () => {
    return (
        <div>
            <Link to="/result">Go to Result Page</Link> {/* Link to the Result Page */}
        </div>
    );
};

export default NavigationComponent;
