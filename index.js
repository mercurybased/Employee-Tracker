const express = require('express');
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT ||3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection(
    {
      host: "127.0.0.1",
      user: "root",
      password: "password",
      database: "employees_db",
    },
    console.log(`Connected to employee database on port ` + PORT)
  );

  function start (){
    inquirer.prompt([
        {
            type:"list",
            name:"wtd",
            message:"What would you like to do?",
            choices: [
                "View All Employees",
                "Add Employee",
                "Update Employee Role",
                "View All Roles",
                "Add Role",
                "View All Departments",
                "Add Department",
                "Quit"
            ]

        }
    ]).then (function (answer) {
        switch (answer.wtd){
            case "View All Employees":
                viewAllEmployees();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Update Employee Role":
                updateEmployee();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "Add Role":
                AddRole();
                break;
            case "View All Departments":
                viewAllDepartments();
                break;
            case "Add Department":
                AddDepartment();
                break;
            case "Quit":
                process.exit();
                }
            })
        };




// const allRoutes = require("./controllers")

// app.use(allRoutes)