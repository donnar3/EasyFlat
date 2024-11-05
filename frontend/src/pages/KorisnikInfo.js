import React, { useEffect, useState } from 'react';

function ProfPrev({ info }) {
    return (
        <div id='card'>
            <img src={info.slika} alt="Profile" />
            <div id='title'>{info.ime}</div>
            <div id='status'>{info.status}</div>
            <div>{info.email}</div>
            <div>{info.telefon}</div>
            <div>Stan {info.stanBr}</div>
        </div>
    );
}

function ProfPodat({ info }) {
    return (
        <div id='data'>
            <div id='title'>Podatci o Korisniku</div>
            <div>Ime i Prezime</div>
            <div>{info.ime}</div>
            <div>Status</div>
            <div>{info.status}</div>
            <div>E Pošta</div>
            <div>{info.email}</div>
            <div>Broj Telefona</div>
            <div>{info.telefon}</div>
            <div>Stan</div>
            <div>{info.stanBr}</div>
            <div>Lozinka</div>
            <div>****</div>
            <button className='uredi'>Uredi</button>
        </div>
    );
}

function Profil({ info }) {
    return (
        <div id='contain'>
            <ProfPrev info={info} />
            <ProfPodat info={info} />
        </div>
    );
}

export default function KorsninkInfo() {
    const [info, setInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:4000/userInfo', {
                    method: 'POST', // Use POST method
                    credentials: 'include' // Include cookies with request
                });
                if (response.ok) {
                    const data = await response.json();
                    setInfo(data);
                } else {
                    console.error('Failed to fetch user data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, []);

    if (!info) {
        return <div>Loading...</div>;
    }

    return <Profil info={info} />;
}
