const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const mongoURI = process.env.mongoDBUrl;
const mongoDB = async()=>{
        await mongoose.connect(mongoURI, {UseNewUrlParser: true}).then(async(res) => {
            console.log("Database connected");
            const fetched_data = await mongoose.connection.db.collection("food_items").find({}).toArray().then(async (data) => {
                const foodCategory = await mongoose.connection.db.collection("foodCategory").find({}).toArray().then((catData) =>{
                    global.food_items = data;
                    global.foodCategory = catData;
                    // console.log(global.food_items);
                    // console.log(global.foodCategory);
                });
            }).catch(error => {
                console.log(error);
            });
          }).catch(error => {
             console.log(error);
        });
        // console.log("MongoDB connected");
}
module.exports = mongoDB;