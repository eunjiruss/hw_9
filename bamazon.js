var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",

    password: "root",
    database: "bamazon"
});

initiate()

function initiate() {
    inquirer
        .prompt([
            {
                name: "to_do",
                type: "list",
                message: "What would you like to do?",
                choices: ["Display", "Exit"]
            }
        ]).then(function (res) {

            if (res.to_do === "Display") {
                display()
            }
            else {
                connection.end()
            }
        })
}

function display() {
    connection.query("SELECT * FROM products", function (err, res) {

        //console.log(res)

        for (var i = 0; i < res.length; i++) {
            console.log(
                "\nItem id: " + res[i].item_id +
                "\nProduct name: " + res[i].product_name +
                "\nDepartment: " + res[i].department_name +
                "\nPrice: " + res[i].price +
                "\nQuantity: " + res[i].stock_quantity +
                "\n----------------------------------------"
            )
        }
        afterDisplay()
    })
}

function afterDisplay() {
    inquirer.prompt([
        {
            name: "to_do",
            type: "list",
            message: "What would you like to do?",
            choices: ["buy something", "Exit"]
        }
    ]).then(function (n) {
        if (n.to_do === "buy something") {
            buy()
        }
        else {

        }
    })
}



function buy() {
    connection.query("SELECT * FROM products", function (err, res) {
        var itemlist = [];
        for (var i = 0; i < res.length; i++) {
            itemlist[i] = res[i].product_name;
        }
        itemlist.push("Exit")

        inquirer
            .prompt([{

                name: "to_buy",
                type: "list",
                message: "What would you like to buy?",
                choices: itemlist
            }
            ]).then(function (res) {

                if (res.to_buy === "Exit") {

                }
                else {
                    connection.query("SELECT * FROM products WHERE product_name =?",
                        [res.to_buy],
                        function (err, res) {
                            var qunt_left = "how many would you like to order? (Max: " + res[0].stock_quantity + ")";

                            inquirer.prompt([
                                {
                                    name: "howmany",
                                    type: "input",
                                    message: qunt_left
                                }
                            ]).then(function (n) {

                                if (Number(n.howmany) <= res[0].stock_quantity) {
                                    var updateQuantity = res[0].stock_quantity - Number(n.howmany);
                                    connection.query("UPDATE products SET ? WHERE ?",
                                        [
                                            {
                                                stock_quantity: updateQuantity

                                            },
                                            {
                                                product_name: res[0].product_name

                                            }
                                        ]
                                        
                                    )
                                    initiate()
                                }
                                else{
                                    console.log("insufficient quantity!")
                                    buy()
                                }
                            })
                        })
                    }
                })
            })
        }



                                    