
import Header from './Header'
import Footer from './Footer'
import Upit from '../pages/Upit'

import Home from '../pages/Home';
import Signup from '../pages/Signup';
import Login from '../pages/Login';

import Contact from '../pages/Contact';
import {BrowserRouter,Routes,Route,Outlet} from 'react-router-dom';
import KontaktDetalji from '../pages/KontaktDetalji';
export default function Router(){
    const Layout=()=>{
        return(
          <>
              <Header/>
              <Outlet/>
              <Footer/>
      
          </>
        )
        }
        const BrowserRouters=()=>{
            return(<BrowserRouter>
                <Routes>
                  <Route path="/" element={<Layout/>}>
                  <Route path="/" element={<Signup/>}/>
                  <Route path="signup" element={<Signup/>}/>

                  <Route path="login" element={<Login/>}/>
                  <Route path="home" element={<Home/>}/>
                  <Route path="contact" element={<Contact/>}/>
                  <Route path="upit" element={<Upit/>}/>
                  <Route path="kontakt/:broj" element={<KontaktDetalji/>}/>
                  </Route>
                </Routes>
              </BrowserRouter>)
        }
    return(
        <BrowserRouters/>
    )
}