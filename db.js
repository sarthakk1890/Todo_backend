const mongoose = require('mongoose');
const database_name = "inotebook" //it'll help to create a user defined database
const mongoURI = `mongodb+srv://144singhsarthak:SArthak@cluster0.s1htyzk.mongodb.net/${database_name}?retryWrites=true&w=majority`;


const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
};
module.exports = connectToMongo;