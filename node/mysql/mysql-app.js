var express   =    require("express");
var mysql     =    require('mysql');
var app       =    express();

var pool      =    mysql.createPool({
    connectionLimit : 200, //important
    host     : 'localhost',
    user     : 'root',
    password : 'admin',
    database : 'restoclouddb',
    debug    :  false
});

function handle_database(req,res) {
    
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id ' + connection.threadId);
        
        connection.query("select * from assignee",function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }           
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
}

function insert_record(table_no, request) {
    
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id ' + connection.threadId);

        if(request == "order") {
            mysql.query('insert into orders (table_no, + order_t +) values ("' + table_no + '", "' + Date.now() + '")',
            function selectCb(err, results, fields) {
                if (err) throw err;
                else res.send('success');
            });
        }
    });
}

app.get("/",function(req,res){-
        handle_database(req,res);
});

app.listen(3000);
