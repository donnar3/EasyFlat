import user from '../assets/images/user.png';

const INFO = {
    slika: user,
    ime: "Iva Ivić",
    status: "Suvlasnik",
    email: "ivaivic@mail.com",
    telefon: "091 222 3333",
    stanBr: "1234"
};

function ProfPrev({info}){
    return (
        <div id='card'>
            <img src={info.slika} alt="slika"/>
            <div id='title'>{info.ime}</div>
            <div id='status'>{info.status}</div>
            <div>{info.email}</div>
            <div>{info.telefon}</div>
            <div>stan {info.stanBr}</div>
        </div>
    );
}

function ProfPodat({info}){
    return (
        <div id='data'>
            <div id='title'>Podatci o Korisniku </div>
            <div>Ime i Prezime</div>
            <div> {info.ime}</div>
            <div>Staus</div>
            <div> {info.status}</div>
            <div>E Pošta</div>
            <div>{info.email}</div>
            <div>Broj Telefona</div>
            <div>{info.telefon}</div>
            <div>Stan</div>
            <div>{info.stanBr}</div>
            <div>Lozinka</div>
            <div>****</div>
            <button class='uredi'>Uredi</button>
        </div>
    )
}

function Profil({info}){
    return (
        <div id='contain'>
            <ProfPrev info = {info}/>
            <ProfPodat info = {info}/>
        </div>
    );
}

export default function KorsninkInfo(){
    return <Profil info = {INFO} />;
}