var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table')

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Lionel10Messi!",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
});

var select = {
    all: function(){
        connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
            if (err) throw err;
            
            var table = new Table({
                head: ['Item ID', 'Product Name', 'Price'],
                colWidths: [100, 200, 100]
            })
        });
    }
}

select.all();