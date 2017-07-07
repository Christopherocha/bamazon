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


var queries = {
    all: function(){
        connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
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

            inquirer.prompt([
                    {
                        name: 'id',
                        message: 'Please enter in the ID of the item you would like to order'
                    },
                    {
                        name: 'count',
                        message: 'How many would you like to buy?'
                    }
                ]).then(function(choice){
                    queries.queryItem(choice.id, choice.count)
            })
        });
    },
    queryItem: function(item, count){
        connection.query("SELECT stock_quantity FROM products WHERE item_id = ?", item, function(err, res){
            if (err) throw err;

            //console.log(res);

            var stock = res[0].stock_quantity;
            console.log(stock);

            if (stock > count){
                console.log('made it');
            } else {
                console.log('I\'m sorry, there is not enough stock of this item to complete your order.\nThere is only ' + parseFloat(stock) + ' left.\nPlease try your order again.');
            }
        })
    }
}

queries.all();