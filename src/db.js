const HOST = "localhost";
const USER = "root";
const PASSWORD = "qwerty12345678";

var mysql = require('mysql');

class DataAccessor {    

    constructor(host, user, password) {
        this._con = mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: "todo_db"
        });
          
        this._con.connect(function(err) {
            if (err) 
                throw err;
            console.log("Connected!");
        });        
    }

    get_status_id_by_name(status_name) {
        console.log("Getting status by id.");
        let con = this._con;
        console.log(status_name);
        const sql_script = `SELECT id FROM statuses WHERE name = "${status_name}"`
        return new Promise(function(resolve, reject) {            
            con.query(sql_script, function(err, result) {
                if (result.length == 0) {
                    err = "Can't get status from data base." // Стоило бы потестить
                }
                if (err) {
                    reject(err);
                } else {                    
                    resolve(result[0].id);
                }
            });
        });
    }

    get_tasks(status_filter_name=null) {
        let con = this._con;
        
        let get_status_id = status_filter_name ? 
            get_status_id_by_name(status_filter_name) 
            : new Promise(function(resolve, reject) {resolve(null)});
        
        return get_status_id.then(function(status_id) {
            let sql_script;
            if (status_id) {
                sql_script = `SELECT * FROM tasks WHERE statuses_id = "${status_id}"`;
            } else {
                sql_script = `SELECT * FROM tasks`;
            }
            return new Promise(function(resolve, reject) {            
                con.query(sql_script, function(err, result) {
                    if (err) {
                        reject(err);
                    } else {                    
                        resolve(result);
                    }
                });
            });
        }).catch((err) => {console.log(err)});        
    }

    insert_task(task_text, task_date, task_status, task_file) {
        let con = this._con;
        this.get_status_id_by_name(task_status).then(function(status_id) {
            let original_name = task_file != undefined ? task_file.originalname : null;
            let file_name = task_file != undefined ? task_file.file_name : null;
            let date = task_date != '' ? task_date : null;
            const user = [task_text, original_name, date, status_id, file_name];
            const sql = "INSERT INTO tasks(text, file_name, date, STATUSES_id, name_on_server) VALUES(?, ?, ?, ?, ?)";
    
            con.query(sql, user, function(err, results) {
                if(err) 
                    console.log(err);
                else 
                    console.log("Данные добавлены");   
            });
        }).catch((err) => {console.log(err)});
    }

    get_statuses() {
        const sql = "SELECT name FROM statuses";        
        let con = this._con;
        return new Promise(function(resolve, reject) {
            // Эта функция будет вызвана автоматически
            console.log("Start getting statuses from database");
            con.query(sql, function(err, result) {
                if(err) 
                    reject(err);
                else {                    
                    let statuses = []
                    for (let i = 0; i < result.length; i++)
                        statuses.push(result[i].name);                                                                         
                    resolve(statuses);
                } 
                    
            });
        });                
    }

    close_connection() {
        // закрытие подключенияo 
        this._con.end(function(err) {
            if (err) {
                console.log("Ошибка: " + err.message);
            }
            console.log("Подключение закрыто.");
        });
    }
}

db = new DataAccessor(HOST, USER, PASSWORD);

module.exports = { db };