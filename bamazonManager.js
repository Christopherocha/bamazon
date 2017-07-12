var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table')

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",

  password: "Lionel10Messi!",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
});

var queries = {
    all: function(){
        connection.query("SELECT item_id, product_name, price FROM products WHERE stock_quantity > 0", function(err, res) {
            if (err) throw err;
            
            var table = new Table({
                head: ['Item ID', 'Product Name', 'Price'],
                colWidths: [25, 50, 25]
            })

            for(var i = 0; i < res.length; i++){
                table.push(
                    [res[i].item_id, res[i].product_name, parseFloat(res[i].price).toFixed(2)]
                );
            }

            console.log(table.toString());
        })
    },
    low: function(){
        connection.query("SELECT item_id, product_name, price FROM products WHERE stock_quantity < 5", function(err, res) {
            if (err) throw err;
            
            var table = new Table({
                head: ['Item ID', 'Product Name', 'Price'],
                colWidths: [25, 50, 25]
            })

            for(var i = 0; i < res.length; i++){
                table.push(
                    [res[i].item_id, res[i].product_name, parseFloat(res[i].price).toFixed(2)]
                );
            }

            console.log(table.toString());
        })
    }
}