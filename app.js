const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3030;

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

app.set("view engine", "ejs");


mongoose.connect('mongodb+srv://pritishbhakat:SKY123@cluster0.0qsqgzn.mongodb.net/todolistDB', { useNewUrlParser: true });

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const Item1 = new Item({
    name: "welcome to your todolist!"
});

const Item2 = new Item({
    name: "Hit the + button to add a new item."
});

const Item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [Item1, Item2, Item3];

app.get("/", function (req, res) {
    Item.countDocuments()
    .then(count => {
        if (count === 0) {
            return Item.insertMany(defaultItems);
        }
    })
    .then(() => {
        console.log("Default items inserted successfully");
    })
    .catch(err => {
        console.log(err);
    });

    Item.find({})
        .then(foundItems => {
            res.render("list", {
                listTitle: "Today",
                newItemLists: foundItems
            });
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/", (req, res) => {
    const itemName = req.body.newItem;

    const item = new Item({
        name: itemName
    });
    item.save();
    res.redirect("/");
});

app.post("/delete",(req,res)=>{
    console.log(req.body.checkbox);
    const checkedItemId=req.body.checkbox;
    console.log(checkedItemId);
    Item.findOneAndRemove({_id: checkedItemId})
    .then(() => {
      console.log("Item removed successfully");
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(PORT, function () {
    console.log("server started on port 3000");
});