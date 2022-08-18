const express = require("express")
require("dotenv").config()
var bodyParser = require('body-parser')
const app = express()
const {getContent,postContent,updateNameAndPass} = require("./confluence")
const {getData, createSuggestion,updateKeyAndId} = require("./notion")
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))
var id1 = ""
var title = ""
app.get("/", async function(req,res){
    res.render("index")

})
app.post("/", bodyParser.urlencoded({extended:false}), (req,res,next)=>{
    var key = req.body.firstName
    var id = req.body.lastName
    var cEmail = req.body.email
    var cPat = req.body.firstName1
    var cUrl = req.body.lastName1
    var cId = req.body.spaceId
    var cTitle = req.body.spaceTitle
    id1 = cId
    title = cTitle
    updateKeyAndId(key,id)
    updateNameAndPass(cEmail,cPat,cUrl)
    getData().then(opt =>{
        res.render("texteditor",{data:opt});
    })
})
app.get("/te", function(req,res){
    getData().then(opt =>{
    res.render("texteditor",{data:opt});
})
})
app.post("/te",function(req,res){
    var txt = req.body.w3review
    postContent(String(id1),String(title),String(txt));
    res.send("Success")
})
app.get("/c2n", function(req,res){
    res.render("c2n")
})
app.post("/c2n",function(req,res){
    var key = req.body.nAPI
    var id = req.body.nBID
    var cEmail = req.body.cemail
    var cPat = req.body.cPat
    var cUrl = req.body.cUrl
    var cId = req.body.cspaceId
    var cTitle = req.body.cspaceTitle
    updateKeyAndId(key,id)
    updateNameAndPass(cEmail,cPat,cUrl)
    getContent(cId,cTitle)
    res.send("Success")
})
app.listen(process.env.PORT, function(){
    console.log("Server started in port 2000");
})