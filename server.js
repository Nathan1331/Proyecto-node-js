var express = require('express')
var bodyParser = require('body-parser')
const { extend } = require('lodash')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

mongoose.Promise= Promise

var dbURL= 'mongodb+srv://user:user@chat-nodejs.gtwodvc.mongodb.net/?retryWrites=true&w=majority'

var Message = mongoose.model('Message', {
    name: String,
    message: String
})



app.get('/messages', (req, res) =>{
    Message.find({}, (err, messages)=>{
        res.send(messages)
    })
    
})

app.get('/messages/:user', (req, res) =>{
    var user = req.params.user
    Message.find({name:user}, (err, messages)=>{
        res.send(messages)
    })  
})

app.post('/messages', async (req, res) =>{

    try {
        var message = new Message(req.body)

        var savedMessage= await message.save()
        
        console.log("Saved")
        
        var censored= await Message.findOne({message:'badWord'})   
    
        
        if(censored){
            await Message.remove({_id: censored.id})
        }
        else
            io.emit('message', req.body)
        
        res.sendStatus(200)    
    } catch (error) {
        res.sendStatus(500)
        return console.error(error)
        
    }
    
    
    //.catch((err)=>{
      //  res.sendStatus(500)
        //return console.error(err)
    //})
    
})

io.on('connection', (socket) =>{
    console.log('someone connected')
})

mongoose.set("strictQuery", false)

mongoose.connect(dbURL, (err) =>{
    console.log('mongo db connection', err)
})

var server = http.listen(3000, ()=>{
    console.log("Server is listening in port ",server.address().port)
})