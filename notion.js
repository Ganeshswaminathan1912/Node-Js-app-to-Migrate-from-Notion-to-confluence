const { Client } = require('@notionhq/client');

var apKey = process.env.NOTION_API_KEY
var blckId = process.env.NOTION_BLOCK_ID

function updateKeyAndId(apiKey,blockId){
    if (apiKey && blockId){
        apKey = apiKey
        blckId = blockId
        //console.log([apKey,blckId])
    }else{
       //console.log([apKey,blckId])
    }
    return [apKey,blckId]
}

function apiKey(key){
    return new Client({ auth:key})
}

const notion = apiKey(apKey);

//retrieving databases to get id's of each column

// (async () => {
//   const databaseId = process.env.NOTION_DATABASE_ID;
//   const response = await notion.databases.retrieve({ database_id: databaseId });
//   console.log(response);
// })();

//retrieving blocks and child blocks
// (async () => {
//   const blockId = process.env.NOTION_BLOCK_ID;
//   const response = await notion.blocks.children.list({ block_id:blockId });
//   return response
// });


//retrieving the required data from blocks(list,paragraph)

async function getId(){
    const blockId = blckId
    const response = await notion.blocks.children.list({block_id:blockId})
    for(i=0;i<response.results.length;i++){        
        return response.results;

    }
}

async function getTitle () {
    const blockId = blckId;
    const response = await notion.blocks.retrieve({
      block_id: blockId,
    });
    return response.child_page.title;
  };
  
var data = []
async function getData(){
    await getTitle().then(opt =>{
        data.push(opt)
      })
    await getId().then(opt =>{
        for(i=0;i<opt.length;i++){
            if(opt[i].type == "paragraph"){
                data.push(opt[i].paragraph.rich_text[0].plain_text);
            }
            else if (opt[i].type == "numbered_list_item"){
                data.push(String([i])+"."+opt[i].numbered_list_item.rich_text[0].plain_text);
            }
        }
    })
    return data
}
//posting to a page children
async function postToBlock(title,content){
    const blockId = blckId;
    const response = await notion.blocks.children.append({
      block_id: blockId,
      children: [
        {
          "heading_2": {
            "rich_text": [
              {
                "text": {
                  "content": title
                }
              }
            ]
          }
        },
        {
          "paragraph": {
            "rich_text": [
              {
                "text": {
                  "content": content,
                }
              }
            ]
          }
        }
      ],
    });
    //console.log(response);
  };
  
//posting to database

function createSuggestion({title,tags,description}){
    getDescription().then(tags2 =>{
    for(i = 0;i<tags2.length;i++){
    notion.pages.create({
        parent:{
            database_id:process.env.NOTION_DATABASE_ID
        },
        properties:{
            [tags2[2]]:{
                title:[{
                    type:"text",
                    text:{
                        content: title
                    }
                }]
            },
            [tags2[1]]:{
                multi_select: tags.map(tag =>{
                    return {id:tag.id}
                })
            },
            [tags2[0]]:{
                rich_text:[{
                    type:"text",
                    text:{
                        content:description
                    }
                }]
            }
        },

    })
}
})
}

//getting tags
async function getTags(){
    const database = await notion.databases.retrieve({
        database_id:process.env.NOTION_DATABASE_ID
    })
    return notionPropertiesById(database.properties)[process.env.NOTION_TAG_ID].multi_select.options.map(option =>{
        return {id:option.id,name:option.name}
    });
  }
  //function to get elements id
  function notionPropertiesById(properties) {
    return Object.values(properties).reduce((obj, property) => {
      const { id, ...rest } = property
      return { ...obj, [id]: rest }
    }, {})
  }
//function to get description id
  async function getDescription(){
    const database = await notion.databases.retrieve({
        database_id:process.env.NOTION_DATABASE_ID
    })
    let propId = notionPropertiesById(database.properties)
    let arr = []
    for (obj in propId){
        arr.push(obj);
    }
    return arr
  }
// getDescription().then(tags2 =>{
//     for(i=0;i<tags2.length;i++){
//     console.log(tags2[i]);
//     }
// })

// async function getQuery(){
//     const database = await notion.databases.query({
//         database_id:process.env.NOTION_DATABASE_ID,

//     })
// }
// async function getQuery(){
//     const database = await notion.databases.query({
//         database_id:process.env.NOTION_DATABASE_ID
//     })
//     return notionPropertiesById(database.properties)
//     [process.env.NOTION_DESCRIPTION_ID].rich_text.options.map(option =>{
//         return{id:option.id,name:option.name}
//     })
// }
// async function getData() {
//     const notionPages = await notion.databases.query({
//       database_id: process.env.NOTION_DATABASE_ID,
//     })
  
//     return notionPages.results.map(fromNotionObject)
//   }
  
//   function fromNotionObject(notionPage) {
//     const propertiesById = notionPropertiesById(notionPage.properties)
  
//     return {
//       id: notionPage.id,
//       title: propertiesById[process.env.NOTION_TITLE_ID].title[0].plain_text,
//       tags: propertiesById[process.env.NOTION_TAG_ID].multi_select.map(
//         option => {
//           return { id: option.id, name: option.name }
//         }
//       ),
//       description:
//         propertiesById[process.env.NOTION_DESCRIPTION_ID].rich_text[0].text
//           .content,
//     }
//   }


module.exports = {
    getData,
    createSuggestion,
    postToBlock,
    updateKeyAndId
}
//getTags().then(tags1=>{
    // createSuggestion({title:"Test",tags:tags1,description:"Hello"})
//})
// postToBlock()




// getListBlock().then(opt =>{
//     console.log(opt);
// })
// getQuery().then(tags=>{
//     for (i = 0; i<tags.length; i++){
//         console.log(tags[i].name);
//     }

//     // createSuggestion({title:"Test",tags:tags,description:"Hello"})

// })
// updateKeyAndId(apKey,"8c38b084a9d5475aae725fad4fb2d10e")
// getData().then(opt =>{
//     console.log(opt);
// })
// updateKeyAndId('secret_ypFX7EJRwgontT9erNdBFKHDRtlrKyVUtc9x0RMH1Yl','8c38b084a9d5475aae725fad4fb2d10e')

// getData().then(opt =>{
//     for(i=0;i<opt.length;i++){
//         console.log(opt[i]);
//     }

// })