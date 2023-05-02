// const express = require('express');
const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table")



const db = mysql.createConnection(
    {
      host: "127.0.0.1",
      user: "root",
      password: "password",
      database: "employees_db",
    },
    console.log(`Connected to employee database on port `)
  );

  console.table(
    `
    '########:'##::::'##:'########::'##::::::::'#######::'##:::'##:'########:'########:
     ##.....:: ###::'###: ##.... ##: ##:::::::'##.... ##:. ##:'##:: ##.....:: ##.....::
     ##::::::: ####'####: ##:::: ##: ##::::::: ##:::: ##::. ####::: ##::::::: ##:::::::
     ######::: ## ### ##: ########:: ##::::::: ##:::: ##:::. ##:::: ######::: ######:::
     ##...:::: ##. #: ##: ##.....::: ##::::::: ##:::: ##:::: ##:::: ##...:::: ##...::::
     ##::::::: ##:.:: ##: ##:::::::: ##::::::: ##:::: ##:::: ##:::: ##::::::: ##:::::::
     ########: ##:::: ##: ##:::::::: ########:. #######::::: ##:::: ########: ########:
    ........::..:::::..::..:::::::::........:::.......::::::..:::::........::........::
    ::::::'########:'########:::::'###:::::'######::'##:::'##:'########:'########::::: 
    ::::::... ##..:: ##.... ##:::'## ##:::'##... ##: ##::'##:: ##.....:: ##.... ##:::: 
    ::::::::: ##:::: ##:::: ##::'##:. ##:: ##:::..:: ##:'##::: ##::::::: ##:::: ##:::: 
    ::::::::: ##:::: ########::'##:::. ##: ##::::::: #####:::: ######::: ########::::: 
    ::::::::: ##:::: ##.. ##::: #########: ##::::::: ##. ##::: ##...:::: ##.. ##:::::: 
    ::::::::: ##:::: ##::. ##:: ##.... ##: ##::: ##: ##:. ##:: ##::::::: ##::. ##::::: 
    ::::::::: ##:::: ##:::. ##: ##:::: ##:. ######:: ##::. ##: ########: ##:::. ##:::: 
    :::::::::..:::::..:::::..::..:::::..:::......:::..::::..::........::..:::::..::::: `);
    

    const startApp = async () => {
    try {
        const ans = await inquirer.prompt({
            type:"list",
            name:"wtd",
            message:"What would you like to do?",
            choices: [
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role",
                "Quit"
            ]
    })
        switch (ans.wtd) {
            case "View All Departments":
                viewAllDepartments();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "View All Employees":
                viewAllEmployees();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Add Role":
                addRole();
                break;
            case "Update Employee Role":
                updateEmployee();
                break;
            case "Quit":
                // process.exit();
                return
        }
        } catch (err){
            console.log(err)
        }
    };

async function viewAllDepartments(){
    const [departments] = await db.promise().query("select * from department")
    console.table(departments)
    startApp();
}
async function viewAllRoles(){
    const [roles] = await db.promise().query("select * from role")
    console.table(roles)
    startApp();
}
async function viewAllEmployees(){
    console.log("test")
    try {
    const [employees] = await db.promise().query("select * from employee")
    console.table(employees)
    startApp();
    }catch (err){
    console.log(err)}
}

async function addDepartment(){
    const ans = await inquirer.prompt({
        type:"input",
        name:"department",
        message:"What department would you like to add?"
    })
    await db.promise().query(`INSERT INTO department (name) VALUES ('${ans.department}')`)
    viewAllDepartments()
}

async function addEmployee(){
    const [roles] = await db.promise().query("select * from role")
    const [employees] = await db.promise().query("select * from employee")
    console.log(employees)
    const ans = await inquirer.prompt([{
        type:"input",
        name:"first_name",
        message:"What is your first name?"
    },
    {
        type:"input",
        name:"last_name",
        message:"What is your last name?"
    },
    {
        type:"list",
        name:"role_id",
        message:"Please choose from one of the roles below",
        choices: roles.map(({title,id})=>({
            name:title,
            value:id
        }))
    },
    {
        type:"list",
        name:"manager_id",
        message:"Who is the employee's manager?",
        choices: employees.map(({first_name,last_name,id})=>({
            name:`${first_name} ${last_name}`,
            value:id
        }))
    }])
    console.log(ans)
    await db.promise().query(`INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ('${ans.first_name}','${ans.last_name}', ${ans.role_id}, ${ans.manager_id})`)
    viewAllEmployees()
}


startApp()