import { useState, useEffect } from "react";
import axios from "axios"
//U KODU e NIJE ERROR NEGO OBJEKT/ELEMENT
export default function Upit(){


    const [email,setEmail] =useState('')
    const [poruka,setPoruka] =useState('')
    const [error,setError] =useState('')
    const [selectData,setselectData] =useState([])
    const [selectValue,setselectValue] =useState('')



    useEffect(()=>{
        let processsing=true
        axiosFetchData(processsing)
        return()=>{processsing=false}
    },[])

    const fetchData = async(processsing) =>{
        const option={method:'GET'}
        await fetch('https://jsonplaceholder.typicode.com/users',option)//OVDIJE CEMO SE KONEKTIRATI NA BAZU PODATAKA U POSTRES SQL
        .then(res=>res.json())
        .then(data=>{
            if(processsing){//optimizacija
            setselectData(data)
        }
        })
        .catch(err=>console.log(err))
    }


    const axiosFetchData = async(processsing) =>{
/*         const options={ //ovo je za post
            email:email,
            message:message
        } */
        await axios.get('https://jsonplaceholder.typicode.com/users')//OVDIJE CEMO SE KONEKTIRATI NA BAZU PODATAKA U POSTRES SQL
        //.then(res=>res.json()) //nepotrebno za axios
        .then(res=>{
            if(processsing){//optimizacija
            setselectData(res.data)
        }
        })
        .catch(err=>console.log(err))
    }


    const SelectDropdown=()=>{
        return(
            <select value={selectValue} onChange={(e)=>setselectValue(e.target.value)}>
                {
                    selectData?.map((item,index)=>(
                        <option value={item.website} key={item.website}>{item.website}</option>
                    ))
                }
            </select>
        )
    }

    const posao=(e)=>{
        e.preventDefault();
        console.log(email+' | '+poruka);
        if(!poruka){setError(<p className="required">Poruka ne smije biti prazna</p>)}
        else{setError('')}
    }
    return (
        <>
            <h1>FORMA / KONTAKTIRAJTE NAS</h1>
            <form className="KontaktForma">
                <label>Email</label>
                <input type="text" id="email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <label>Koja je tema vaseg upita?</label>

                <SelectDropdown/>
                <label>Poruka</label>
                <textarea id="poruka" name="poruka" value={poruka} onChange={(e)=>setPoruka(e.target.value)}></textarea>
                {error}
                <button type="submit" onClick={posao}>Posalji</button>
            </form>
        </>
    )
    
    } 