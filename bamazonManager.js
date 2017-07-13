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
        connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res) {
            if (err) throw err;
            
            var table = new Table({
                head: ['Item ID', 'Product Name', 'Price', 'Stock'],
                colWidths: [25, 50, 25, 25]
            })

            for(var i = 0; i < res.length; i++){
                table.push(
                    [res[i].item_id, res[i].product_name, parseFloat(res[i].price).toFixed(2), parseFloat(res[i].stock_quantity)]
                );
            }

            console.log(table.toString());
        })
    },
    low: function(){
        connection.query("SELECT item_id, product_name FROM products WHERE stock_quantity < 5", function(err, res) {
            if (err) throw err;
            
            var table = new Table({
                head: ['Item ID', 'Product Name'],
                colWidths: [25, 50]
            })

            for(var i = 0; i < res.length; i++){
                table.push(
                    [res[i].item_id, res[i].product_name]
                );
            }

            console.log(table.toString());
        })
    },
    addStock: function(){
        inquirer.prompt([
            {
                name: 'item',
                message: 'Please enter in the ID of the item you would like to update the stock to'
            },
            {
                name: 'amount',
                message: 'Please enter in the stock amount you would like to add to this item'
            }
        ]).then(function(choice){
            var curStock;
            connection.query("SELECT stock_quantity FROM products WHERE item_id = ?", choice.id, function(err, res){
                curStock = res[0].stock_quantity;
            })
            var newStock = parseFloat(stock) + parseFloat(curStock);      
            connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ? ", [choice.id, newStock], function(err, res){
                if(err) throw err;
                console.log("Item_id: " + choice.id + "'s stock has been successfully updated to a total of " + newStock);
            })
        })
    },
    addItem: function(){

    }
}

inquirer.prompt({
    name: 'task',
    message: 'What would you like to do',
    type: 'list',
    choices: ['View all items for sale', 'View low inventory', 'Add stock to an existing item', 'Add a new product']
}).then(function(choice){
    if(choice.task === 'View all items for sale'){
        queries.all();
        connection.end();
    } else if(choice.task === 'View low inventory'){
        queries.low();
        connection.end();
    } else if(choice.task === 'Add stock to an existing item'){
        queries.all();
        queries.addStock();
        
    } else {
        queries.addItem();
    }
})