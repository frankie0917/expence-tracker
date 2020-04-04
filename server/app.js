const app = require("express")();
const mongoose = require("mongoose");
const Record = require("./model/Record.model");
const cors= require('cors')
const bodyparser = require('body-parser')

mongoose.connect("mongodb://localhost/expenceTracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

app.use(cors())

app.use(bodyparser.json())

app.get("/", async(req, res) => {
  try{
    const records = await Record.find();
    res.send(records);
  }catch(e){
    console.log(e)
    res.status(500).send("error ocurred")
  }
});

app.post("/",async (req,res)=>{
  try{
    await Record.create(req.body)
    res.send("ok")
  }catch(e){
    console.log(e)
    res.status(500).send("error ocurred")
  }
})

app.put('/',async(req,res)=>{
  try{
    await Record.update(req.body)
    res.send("ok")
  }catch(e){
    console.log(e)
    res.status(500).send("error ocurred")
  }
})
app.delete('/',async(req,res)=>{
  try{
    await Record.deleteOne(req.body)
    res.send("ok")
  }catch(e){
    console.log(e)
    res.status(500).send("error ocurred")
  }
})

const PORT = 5000

app.listen(PORT, () => {
  console.log("server is listening on:"+ PORT);
});
