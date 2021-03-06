// подключение express
const express = require("express");
const ejs = require('ejs');
const multer  = require("multer");

const path = require('path'); 
    
// создаем объект приложения
const app = express();
// добавляет возможность доставать переменные из ответа (и загружать файлы)
app.use(express.static(__dirname + '/static'));
app.use(multer({dest:"./static/files"}).single("file"));
app.set('view engine', 'ejs');
app.set('views', './static/pages')
var db = require("./db").db;
var data_manipulator = require("./data_manipulator").manipulator;

app.get("/", function(request, response){    
    db.get_statuses().then(function(statuses) {          
      // получаем список всех существующих задач в бд
      db.get_tasks().then(function(tasks) { 
        let status_map = data_manipulator.get_status_map(statuses);
        let status_names = Array.from(status_map.values());
        tasks = manipulator.status_id_to_name(tasks, status_map);        
        response.render("main.ejs", 
          {"statuses": status_names, 
          "selected_status_name": "",
          "tasks": tasks});
      });
    }).catch((err) => {console.log(err)})
});

app.post("/", function(request, response){
    // отправляем ответ
    // let status = request.body.status;
    let text = request.body.task;
    let date = request.body.date;
    let filedata = request.file;
    let status = request.body.status;   
    if(!filedata)
      console.log("Не было передано файлов");
    else
      console.log("Файл загружен");

    db.insert_task(text, date, status, filedata).then(function() {
      response.redirect("/");
    });
});

app.post("/filter", function(request, response){
  let status_name;
  // проблема: не видит request.body
  console.log(`status:${request.body.status}`);
  if (request.body.status == "all") {
    response.redirect("/");
  } else {
    status_name = request.body.status;
    db.get_statuses().then(function(statuses) {          
      let status_map = data_manipulator.get_status_map(statuses);  
      db.get_tasks(status_name).then(function(tasks) {         
        let status_names = Array.from(status_map.values());        
        tasks = manipulator.status_id_to_name(tasks, status_map);                
        response.render("main.ejs", 
          {"statuses": status_names, 
          "selected_status_name": status_name, 
          "tasks": tasks
        });
      });
    }).catch((err) => {console.log(err)})
  }  
});

app.post("/delete", function(request, response) {  
  db.delete_task(request.body.task_id).then(function() {
    response.redirect("/");
  });
});

// начинаем прослушивать подключения на 3000 порту
app.listen(3000);