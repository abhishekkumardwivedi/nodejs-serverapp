var mysql = require("mysql");

// First you need to create a connection to the db
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "restoclouddb"
});

function create_conn() {
  con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
  });
}

exports.get_order_history = function() {
  create_conn();
  con.query('SELECT * FROM orders',function(err, rows) {
  if(err) throw err;
    console.log('Data received from Db:\n');
    console.log(rows);
  });
  //return rows;
}

function get_past_states(table_id) {
  create_conn();
  var past;
  con.query('SELECT past FROM past where table_no=?', table_id, function(err, rows) {
  if(err) throw err;
    console.log('Data received from Db:\n');
    past = rows[0].past;
    console.log(past);
  });
  return past;
}

exports.create_table_nos = function(tables) {
  con.query('DELETE FROM past',
    function(err,res){
    if(err) throw err;
  });

  for(var i = 0; i < tables; i++) {
    con.query('INSERT INTO past (table_no) value (?)',
        i+1,
	function(err,res){
    	  if(err) throw err;
    });
  }
  conn_end();
}

exports.update_req = function(table_id, req) {
  if(req == 'order_ack') {
    con.query('UPDATE orders set ack=now() where table_no=? and req_type="order_req"',
                table_id,
	function(err,res){
    	  if(err) throw err;
    });
    con.query('update past set past="order_ack" where table_no=?',
                table_id,
	function(err,res){
    	  if(err) throw err;
    });
  }
  if(req == 'ticket_ack') {
    con.query('UPDATE orders set ack=now() where table_no=? and req_type="ticket_req"',
                table_id,
	function(err,res){
    	  if(err) throw err;
    	  console.log('Last insert ID:', res.insertId);
    });
    con.query('update past set past="ticket_ack" where table_no=?',
                table_id,
	function(err,res){
    	  if(err) throw err;
    	  console.log('Last insert ID:', res.insertId);
    });
  }
  if(req == 'order_req') {
    con.query('INSERT INTO orders (table_no, req, req_type) value (?, now(), "order_req")',
                table_id,
	function(err,res){
    	  if(err) throw err;
    	  console.log('Last insert ID:', res.insertId);
    });
    con.query('update past set past="order_req" where table_no=?',
                table_id,
	function(err,res){
    	  if(err) throw err;
    	  console.log('Last insert ID:', res.insertId);
    });
  }
  if(req == 'ticket_req') {
    con.query('INSERT INTO orders (table_no, req, req_type) value (?, now(), "ticket_req")',
                table_id,
	function(err,res){
    	  if(err) throw err;
    	  console.log('Last insert ID:', res.insertId);
    });
    con.query('update past set past="ticket_req" where table_no=?',
                table_id,
	function(err,res){
    	  if(err) throw err;
    	  console.log('Last insert ID:', res.insertId);
    });
  }
  if(req == 'cancel') {
    var past = get_past_states(table_id);
    console.log(past);
    if (past == 'order_ack' || past == 'ticket_ack') return;
    con.query('DELETE FROM orders WHERE table_no= ? and req_type= "ticket_req" and ack is null',
      table_id,
      function (err, result) {
        if (err) throw err;
      }
    );
  }
}

exports.remove_row = function(table_id, req, data) {
}

function conn_end() {
  con.end(function(err) {
    //console.log('Connection quit!');
  });
}
