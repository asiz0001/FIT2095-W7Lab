let express = require('express');
let ejs = require("ejs");
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let app = express();

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(express.static("img"));
app.use(express.static("css"));

app.use(bodyParser.urlencoded({
    extended: false
}));

let Task = require('./models/task');
let Developer = require('./models/developer');

let url = "mongodb://localhost:27017/week7lab";

mongoose.connect(url, function (err) {
    if (err) 
        console.log(err);
    else {
        console.log("Connected to database");
    }
});

app.get("/", function(req,res) {
    res.render("index.html");
});

app.get("/newdeveloper", function(req,res) {    
    res.render("newdeveloper.html");
});

app.get("/listdevelopers", function(req,res) {
    Developer.find({}, function(err,data) {
        res.render("developerlist.html", {developers: data});
    });
});

app.get("/newtask", function(req,res) {
    res.render("newtask.html");
});

app.get("/listtasks", function(req,res) {
    Task.find({}, function(err,data) {
        res.render("tasklist.html", {tasks: data});
    });
});

app.get("/deleteall", function(req,res) {
    res.render("deleteall.html");
});

app.get("/deletetask", function(req,res) {
    res.render("deletetask.html");
});

app.get("/updatetask", function(req,res) {
    res.render("updatetask.html");
});

//Extra task code
app.get("/:old/:new", function(req,res) {
    oldName = req.params.old;
    newName = req.params.new;

    Developer.updateMany({"name.firstName" : oldName}, {$set: {"name.firstName" : newName}}, function(err, doc) {
        if (err)
            console.log(err);
        else {
            console.log("Name changed");
            res.redirect("/listdevelopers");
        }  
    });
});

app.post("/adddev", function(req,res) {
    let body = req.body;

    let newDeveloper = new Developer({
        name: {
            firstName: body.firstName,
            lastName: body.lastName
        },
        level: body.level,
        address: {
            state: body.state,
            suburb: body.suburb,
            street: body.street,
            unit: body.unit
        }
    });

    newDeveloper.save(function(err) {
        if (err) {
            console.log(err);
            res.redirect("/newdeveloper");
        } else {
            res.redirect("/listdevelopers");
        }   
    });
});

app.post("/addtask", function(req,res) {
    let d = new Date(req.body.due);

    let newTask = new Task({
        name: req.body.name,
        assignedTo: req.body.assignedTo,
        due: d,
        status: req.body.status,
        desc: req.body.desc
    });

    newTask.save(function(err) {
        if (err) {
            console.log(err);
            res.redirect("/newtask");
        } else {
            res.redirect("/listtasks");
        }
    });
});

app.post("/clear", function(req,res) {
    let query = {status: "Complete"}

    Task.deleteMany(query, function(err, data) {});
    
    res.redirect("/listtasks");
});

app.post("/delete", function(req,res) {
    query = {_id: req.body.taskID};
    
    Task.deleteMany(query, function(err, obj) {

    });

    res.redirect("/listtasks");
});

app.post("/update", function(req,res) {
    let status = req.body.status;
    query = {_id: req.body.taskID};
    
    Task.updateMany(query, {$set: {status: status} } ,function(err, obj) {});   
    
    res.redirect("/listtasks");
});

app.listen(8080);