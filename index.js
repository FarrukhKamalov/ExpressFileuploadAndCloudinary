const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary')
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/image',{useNewUrlParser: true, useUnifiedTopology: true})
.then(result =>{
        console.log('mongodb')
}).catch(err =>{
    console.log(err)
});
const image =  mongoose.Schema({
    imgurl: String
})
 
const img = mongoose.model('image', image);

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(fileUpload({useTempFiles: true}));


cloudinary.config({
    cloud_name :'file-upload',
    api_key:'731456294949825',
    api_secret:'FBVBUiPRE6xJmS_pEWWxjIhYMWU' 
});

app.get('/' , (req , res)=>{
   res.render('index')
});

 app.get('/fileupload' , (req , res)=>{
    res.render('file-upload');
 });

app.post('/fileupload' , (req , res)=>{
        cloudinary.uploader.upload(req.files.file.tempFilePath)
        .then((result) => {
             console.log(result)
            const imgsave =  new img ({ imgurl: result.url });
            imgsave.save((err, result)=>{
                if(result){
                    console.log(result)
                }else{
                    console.log(err)
                }
            })
        }).catch((error) => {
            res.status(500).send({
            message: "failure",
            error,
         });
        });
       
});

app.get('/files' , (req , res)=>{
   img.find()
   .then(result => {
       res.render('files', {result})
   }).catch(err =>{
       console.log(err)
   });
    
})



app.listen(8000, () => {
    console.log(`Server started on http://localhost:8000`);
});