import express from "express";
import multer from "multer";
import path from "path";
import env from "dotenv";
import main from "./database.js";
import { createUser, getAllUsers } from "./database.js";

//Initializing dotenv middleware
env.config();

const app = express();
const port = 3000;

//setting the destination folder where files will be uploaded and what the filename of the photos would be
const storage = multer.diskStorage({ 
    destination: './uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    } 
});

//Initializing multer middleware with setting filter for image files
const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
});

//checks if the files uploaded are images or not
function checkFileType(file, cb){
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null, true);
    } else{
        cb("Error: Images only! (jpeg, jpg, png, gif)");
    }
}

//handling POST request to add a new user to the database 
app.post("/user", upload.array("photos", 10), (req, res) => {
    try{
        const name = req.body.name;
        const handle = req.body.handle;
        const photos = req.files;
        console.log(photos);
        const path = photos.map((photo)=>{
            return photo.path;
        });
        console.log(path);
        const result = createUser(name, handle, path);
        if(result){
            res.send("User saved successfully");
        } else{
            res.send("Process failed");
        }
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

//handling GET request for getting all of the users data when Admin logs in
app.get("/users", async(req, res) => {
    try{
        const result = await getAllUsers();
        console.log(result);
        res.send(result);
    } catch(err){
        console.log(err);
        res.sendStatus(404);
    }
})

//function for listening to port
app.listen(port, () => {
    console.log("Server is running on port 3000.");
    main();
});