// src/components/Login.js
import React, { useState,useEffect } from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error,setError] =useState('')




    const axiosPostData=async()=>{
        console.log("Prvi")


        const postData={
            email: email,
            sifra:password
        }
        console.log(postData)
            await axios.post('http://localhost:4000/login', postData)
            .then(res=>setError(<p className="success">{res.data}</p>));

    }


    const login=(e)=>{
        console.log(email);
        e.preventDefault();
        if(!email){setError(<p className="required">email ne smije biti prazna</p>)}
        else{setError('')}
        setError('')
        axiosPostData();
    }




    return (
        <form>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error}
            <button type="submit" onClick={login}>Login</button>
        </form>
    );
};

export default Login;
