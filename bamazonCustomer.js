var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "*********",
    database: "bamazon"
})
var products = []

function main(){
    connection.query("SELECT * FROM products",function(err,res){
        if (err) throw err;
        res.forEach(function(line){
            var product = {
                id:line.item_id,
                product:line.product_name,
                category:line.department_name,
                price:line.price,
                quantity:line.stock_quantity
            }
            products.push(product);
        });
        console.log(products);
        inquirer.prompt([
            {
                type:"prompt",
                name:"item",
                message:"What is the ID of the item you want to buy?",
                validate:function(value){
                    return(isNaN(value)===false && parseInt(value)>0 && parseInt(value)<=products.length)
                }
            },
            {
                type:"prompt",
                name:"amount",
                message:"how much product do you want?",
                validate:function(value){
                    return(isNaN(value)===false && parseInt(value)>0)
                } 
            }
        ]).then(function(val){
            var amount = parseInt(val.amount);
            var item = parseInt(val.item);
            connection.query("SELECT * FROM products WHERE ?",{
                item_id:item
            },function(err,response){
                if(err)throw err;
                var res = response[0];
                if(res.stock_quantity<amount){
                    console.log("Sorry, we do not have enough product")
                    again();
                }
                else{
                    connection.query("UPDATE products SET ? WHERE ?",[
                    {
                        stock_quantity:(res.stock_quantity-amount)
                    },
                    {
                        item_id:item
                    }],function(err,response){
                        if(err)throw err;
                        console.log(response);
                        var price = res.price*amount
                        console.log("You bought $"+price+" of "+res.product_name);   
                        again();        
                    })
                }
            })
        })
    })
}
function again(){
    inquirer.prompt([{
        type:"confirm",
        message:"Do you want to buy something else?",
        name:"again"
    }]).then(function(res){
        if(res.again){
            main();
        }
        else{
            connection.end();
        }
    })
}
main();