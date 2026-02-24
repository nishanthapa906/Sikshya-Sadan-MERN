import express from "express" ;

const app = express();
const PORT = 9000; 


import connectDb from "./db/connect";

//connect database
connectDb();


//application setting
app.use(express.json());



app.use('/image/', express.static('./public/Images'))

//base routes



app.listen(PORT , ()=>{
  console.log(`App is listening at ${PORT}.!`)
});


