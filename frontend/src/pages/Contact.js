function Contact(){
    return(
        <>
        <h1>Kontaktirajte nas ako imate problema</h1>

        <ul className="KontaktBox">
            <li>
                <a href="/kontakt/1" className="linkKontakta"><img className="slikaPoziva" src={require('../assets/images/LC_hephaistos.jpg')} alt="Slika nase zgrade ili tako nes"/></a>
                <br/>
                <a href="/kontakt/1" className="linkKontakta">Hiperlink koji vodi na kontakt info ili radi tako nes</a>
            </li>
            <li>
            <a href="/kontakt/999" className="linkKontakta"><img className="slikaPoziva" src={require('../assets/images/images.png')} alt="Slika firme ili tako nes"/></a>
                <br/>
                <a href="/kontakt/999" className="linkKontakta">Hiperlink koji vodi na kontakt info ili radi tako nes</a>
            </li>
        </ul>
        </>
    )
}
export default Contact;