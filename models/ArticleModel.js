// models/Question.js
const mongoose = require("mongoose");

const ArticleModel = new mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  
});// models/Question.js
const mongoose = require("mongoose");

const ArticleModel = new mongoose.Schema({
  Title: { 
      type: String,
     required: true 
    },
  Description: { 
    type: String, 
    required: true
   },
    photo:{
       public_id :{
        type:String,
        required:true,
       },
       url:{
        type:String,
        required:true,

       }
    }
  
  
});

const Article = mongoose.model("Article", ArticleModel);
module.exports = Article;


const Article = mongoose.model("Article", ArticleModel);
module.exports = Article;
