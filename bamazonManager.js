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
  //console.log("connected as id " + connection.threadId);
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
        connection.end();
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
        connection.end();
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
            connection.query("SELECT stock_quantity FROM products WHERE item_id = ?", choice.item, function(err, res){
                if(err) throw err;
                console.log(res);
                curStock = res[0].stock_quantity;
            })
            var newStock = parseFloat(choice.amount) + parseFloat(curStock); 
            var strConv = parseFloat(choice.item);
            console.log("newStock type: " + typeof newStock + "\nchoice.item type: " + typeof strConv)    
            connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newStock, strConv], function(err, res){
                if(err) throw err;
                console.log(res)
                console.log("Item_id: " + choice.item + "'s stock has been successfully updated to a total of " + newStock);
            })
        connection.end();
        })
    },
    addItem: function(){
        inquirer.prompt([
            {
                name: 'name',
                message: 'What would you like the name of your product to be?'
            },
            {
                name: 'dept',
                message: 'What shoe department does this item belong to?'
            },
            {
                name: 'price',
                message: 'What is the price of this item? ex. 50.00'
            },
            {
                name: 'stock',
                message: 'How many of this item are in stock?'
            }
        ]).then(function(choices){
            connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", [choices.name, choices.dept, choices.price, choices.stock], function(err, res){
                if(err) throw err;

                console.log("The new product has been added.")
            })
            connection.end();
        })
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
    } else if(choice.task === 'View low inventory'){
        queries.low();
    } else if(choice.task === 'Add stock to an existing item'){
        queries.addStock();
    } else {
        queries.addItem();
    }
})