var Confluence = require("confluence-api");
const {getData, createSuggestion,postToBlock} = require("./notion")

var config = {
    username: process.env.CONFLUENCE_MAIL_ID,
    password: process.env.CONFLUENCE_API_ID,
    baseUrl:  process.env.CONFLUENCE_URL,
    version: 7.19 
};

function updateNameAndPass(uName,pass,bUrl){
    if (uName && pass && bUrl){
        config.username = uName
        config.password = pass
        config.baseUrl = bUrl
        //console.log([config.username,config.password,config.baseUrl])
    }else{
       //console.log([config.username,config.password,config.baseUrl])
    }
    return [config.username,config.password,config.baseUrl]
}

var confluence = new Confluence(config);
function getContent(spaceId,pageTitle){
confluence.getContentByPageTitle(spaceId, pageTitle, function(err, data) {
    if(data){
        postToBlock(String(pageTitle),String(data.results[0].body.storage.value));
    }
    else{
        console.log(err)
    }
    
});
}
function postContent(spaceId,title,content){
    confluence.postContent(spaceId,title,content,"",function(err,res){
        if (err){
             return err;
        }else{
            return res;
        }
    })

}

// console.log(getContent("C2N","Confluence to Notion"))
// console.log(String(cont))
// getData().then(opt =>{
//        postContent("C2N","Notion to Confluence",String(opt));
//     })
// getContent("C2N","Confluence to Notion")
    //postContent("C2N","Notion to Confluence",opt)

module.exports = {
    getContent,
    postContent,
    updateNameAndPass
}
