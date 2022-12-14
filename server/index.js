const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const FoodModel = require("./models/Food");
const { update } = require('./models/Food');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

mongoose.connect('mongodb+srv://jbenedictodb:Vw65ZvaulbsXfDwC@cluster0.jozgp08.mongodb.net/food?retryWrites=true&w=majority', {
    useNewUrlParser: true,
});

app.post('/insert', async (req, res) => {
    const foodName = req.body.foodName;
    const days = req.body.days;
    const food = new FoodModel({foodName: foodName, daysSinceIAte: days });
    
    try {
        await food.save();
        res.send("inserted data");
    } catch (err) {
        console.log(err)
    }
});

app.get('/read', async (req, res) => {
//    FoodModel.find({$where: {foodName: "Apple"}},)
    FoodModel.find({}, (err, result) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send(result);
        }
    });
});

app.put('/update', async (req, res) => {
    const newFoodName = req.body.newFoodName;
    const id = req.body.id;
    
    try {
        await FoodModel.findById(id, (err, updatedFood) => {
            updatedFood.foodName = newFoodName;
            updatedFood.save();
            res.send("update");
        });
    } catch (err) {
        console.log(err);
    }
});

app.delete('/delete/:id', async (req, res) => {
    await FoodModel.findByIdAndRemove({ _id: req.params.id})
        .then((doc) => console.log(doc))
        .catch((err) => console.log(err));
});

app.listen(3001, () => {
    console.log("Server running on port 3001...");
});