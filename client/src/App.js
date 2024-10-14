import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('/api/message')
            .then(response => {
                setMessage(response.data.message);
            })
            .catch(error => {
                console.error('There was an error fetching the message!', error);
            });
    }, []);

    return (
        <div className="App">
            <h1>Fullstack App</h1>
            <p>Message from server: {message}</p>
        </div>
    );
}

export default App;
