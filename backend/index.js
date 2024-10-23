const express= require('express')
const cors=require('cors')
const bodyParser=require('body-parser')
const router=require('./routes/router')
const os = require('os'); 

const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));



const corsOptions={
    origin:'*',
    credentials:true,
    optionalSuccessStatus:200
}

app.use(cors(corsOptions));
app.use('/',router);



const port=4000;
const server = app.listen(port,()=>{
    console.log(`Server se pokreće na: http://localhost:${port}`);

})