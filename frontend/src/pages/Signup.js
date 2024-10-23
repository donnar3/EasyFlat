import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function Upit() {
    const navigate = useNavigate(); // Initialize useNavigate
    const [ime, setIme] = useState('');
    const [prezime, setPrezime] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');

    

    const [poruka, setPoruka] = useState('');
    const [error, setError] = useState('');
    const [selectValue, setSelectValue] = useState('');
    const [selectData, setSelectData] = useState([]);

    useEffect(() => {
        let processing = true;
        fetchData(processing);
        return () => { processing = false; };
    }, []);

    const fetchData = async (processing) => {
        try {
            const response = await axios.get('http://localhost:4000/users'); // Adjust to your endpoint
            if (processing) {
                setSelectData(response.data);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch data. Please try again later.');
        }
    };

    const SelectDropdown=()=>{
        return(
            <select value={selectValue} onChange={(e)=>setSelectValue(e.target.value)}>
                {
          selectData?.map((item) => (
            <option value={item.stan_id} key={item.stan_id}>
              {item.stan_id}
            </option>
                    ))
                }
            </select>
        )
    }

    const axiosPostData = async () => {
        const postData = {
            ime,
            prezime,
            email,
            website: selectValue,
            poruka,
        };

        try {
            const response = await axios.post('http://localhost:4000/register', postData); // Adjust to your endpoint
            setError(<p className="success">{response.data}</p>);
        } catch (err) {
            console.error(err);
            setError(<p className="error">Registration failed. Please try again.</p>);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password!=passwordAgain) {
            setError(<p className="required">Sifre moraju biti iste</p>);
            return;
        }

        setError('');
        axiosPostData();
    };
    const handleLoginRedirect = () => {
        navigate('/login'); // Redirect to /login
    };
    return (
        <>
            <h1>FORMA / KONTAKTIRAJTE NAS</h1>
            <form className="KontaktForma" onSubmit={handleSubmit}>
                <label>Ime</label>
                <input type="text" id="ime" value={ime} onChange={(e) => setIme(e.target.value)} required />

                <label>Prezime</label>
                <input type="text" id="prezime" value={prezime} onChange={(e) => setPrezime(e.target.value)} required />

                <label>Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <label>ID vašeg stana</label>

                <SelectDropdown />

                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />


                <label>Ponovite šifru:</label>
                <input type="password" value={passwordAgain} onChange={(e) => setPasswordAgain(e.target.value)} required />
                {error && <div>{error}</div>}

                <button type="submit">Pošalji upit</button>

                <button type="button" onClick={handleLoginRedirect}>Povratak na login</button> {/* Change type to button */}
            </form>
        </>
    );
}
