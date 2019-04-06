var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "********",
    database: "bamazon"
})

var theLength=0;
function main(){
    inquirer.prompt([{
        type:"list",
        choices:["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product","Exit"],
        name:"pick",
        message:"Hello Manager, what would you like to do?"
    }]).then(function(res){
        if(res.pick==="View Products for Sale") view(true);
        else if(res.pick==="View Low Inventory") low();
        else if (res.pick==="Add to Inventory") addInv();
        else if(res.pick==="Add New Product") addNew();
        else connection.end();
    })
}

function view(bool){
    var products = [];
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
        theLength=products.length;
        console.log(products);
        if(bool) main();
    });
}
function low(){
    var products = [];
    connection.query("SELECT * FROM products WHERE stock_quantity<5",function(err,res){
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
    main();
    });
}
function addInv(){
    view(false);
    inquirer.prompt([
        {
            type:"prompt",
            name:"item",
            message:"What is the id of the item you want to add product to?",
            validate:function(value){
                return(isNaN(value)===false && parseInt(value)>0 && parseInt(value)<=theLength)
            }
        },
        {
            type:"prompt",
            name:"amount",
            message:"how much product do you to add?",
            validate:function(value){
                return(isNaN(value)===false && parseInt(value)>0)
            } 
        }
    ]).then(function(val){  
        connection.query("UPDATE products SET stock_quantity=stock_quantity+"+parseInt(val.amount)+" WHERE ?",[
        {
            item_id:val.item
        }],function(err,response){
            if(err)throw err;
            console.log("product added");   
            main();        
        })
    })
}
function addNew(){
    inquirer.prompt([
        {
            name:"name",
            type:"input",
            message:"what item do you want to add?"
        },
        {
            name:"department",
            type:"input",
            message:"what department is this under?"
        },
        {
            name:"price",
            type:"input",
            message:"How much are we selling this for?",
            validate:function(value){
                return(isNaN(value)===false&&parseFloat(value)>0);
            }
        },
        {
            name:"stock",
            type:"input",
            message:"how much do we have?",
            validate:function(value){
                return(isNaN(value)===false&&parseInt(value)>=0);
            }
        }
    ]).then(function(res){
        connection.query('INSERT INTO products (product_name,department_name, price,stock_quantity) VALUES (?,?,?,?)',
        [res.name,res.department,res.price,res.stock],
        function(err,val){
            if(err)throw err;
            console.log("item added");
            main();
        });
    })
}
main();