import mongoose from "mongoose";

//setting strictquery to false meaning opting in for "notInSchema" filter options
mongoose.set("strictQuery", "false");

//Getting the Schema class from mongoose
const Schema = mongoose.Schema;

//defining the schema of the user
const userSchema = new Schema({
    name: String,
    Social_media_handle: String,
    photos: [String]
});

//defining the user model based on userSchema
const user = mongoose.model("user", userSchema);

//function to save a new user document into the database
async function createUser(name, handle, path){
    try{
        const new_user = new user({
            name: name,
            Social_media_handle: handle,
            photos: path
        });
        await new_user.save();
        return 1;
    } catch(err){
        console.log(err);
        return 0;
    }
}

//function to get all the data of the users who are registered
async function getAllUsers(){
    try{
        const result = await user.find({});
        return result;
    } catch(err){
        console.log(err);
    }
}

//function for connecting to mongo database using mongoose
async function main(){
    try{
        const mongoDb = process.env.DB_URL;
        await mongoose.connect(mongoDb);
        console.log("Connected to database!");
    } catch(err) {
        console.log(err);
    }
}

export { createUser, getAllUsers };
export default main;