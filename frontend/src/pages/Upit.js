import { useState, useEffect } from "react";
import axios from "axios";

export default function Upit() {
    const [email, setEmail] = useState('');
    const [poruka, setPoruka] = useState('');
    const [error, setError] = useState('');
    const [selectData, setSelectData] = useState([]);
    const [selectValue, setSelectValue] = useState('');
    const [protectedData, setProtectedData] = useState(null); // State to store protected data

    useEffect(() => {
        let processing = true;
        axiosFetchData(processing);
        fetchProtectedData(); // Fetch protected data on mount
        return () => { processing = false; }
    }, []);

    const fetchData = async (processing) => {
        const option = { method: 'GET' };
        await fetch('https://jsonplaceholder.typicode.com/users', option)
            .then(res => res.json())
            .then(data => {
                if (processing) {
                    setSelectData(data);
                }
            })
            .catch(err => console.log(err));
    };

    const axiosFetchData = async (processing) => {
        try {
            const response = await axios.get('http://localhost:4000/users', {
                withCredentials: true, // kookie se salje 
            });
    
            if (processing) {
                setSelectData(response.data);
            }
        } catch (err) {
            console.log(err);
        }
    };
    

    const fetchProtectedData = async () => {
        try {
            const response = await axios.get('http://localhost:4000/protected', {
                withCredentials: true,
            });
            setProtectedData(response.data);
        } catch (error) {
            console.error("Error fetching protected data:", error);
            // Handle error 
        }
    };

    const SelectDropdown = () => {
        return (
            <select value={selectValue} onChange={(e) => setSelectValue(e.target.value)}>
                {
                    selectData?.map((item) => (
                        <option value={item.stan_id} key={item.stan_id}>
                            {item.stan_id}
                        </option>
                    ))
                }
            </select>
        );
    };

    const axiosPostData = async () => {
        const postData = {
            email: email,
            website: selectValue,
            poruka: poruka
        };
        console.log(postData);
        await axios.post('http://localhost:4000/contact', postData, {
            withCredentials: true // Send cookies with the request
        })
        .then(res => setError(<p className="success">{res.data}</p>))
        .catch(err => {
            console.error("Error submitting data:", err); // Log the error
            if (err.response && err.response.status === 401) {
                setError(<p className="error">Unauthorized: You must log in first.</p>);
            } else {
                setError(<p className="error">Something went wrong. Please try again.</p>);
            }
        });
    };
    

    const posao = (e) => {
        e.preventDefault();
        if (!poruka) {
            setError(<p className="required">Poruka ne smije biti prazna</p>);
        } else {
            setError('');
            axiosPostData();
        }
    };

    return (
        <>
            <h1>FORMA / KONTAKTIRAJTE NAS</h1>
            <form className="KontaktForma">
                <label>Email</label>
                <input type="text" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label>Koja je tema vaseg upita?</label>
                <SelectDropdown />
                <label>Poruka</label>
                <textarea id="poruka" name="poruka" value={poruka} onChange={(e) => setPoruka(e.target.value)}></textarea>
                {error}
                <button type="submit" onClick={posao}>Posalji</button>
            </form>

            {protectedData && (
                <div>
                    <h2>Protected Data:</h2>
                    <pre>{JSON.stringify(protectedData, null, 2)}</pre>
                </div>
            )}
        </>
    );
}
