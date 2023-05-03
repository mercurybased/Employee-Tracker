const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const db = mysql.createConnection(
  {
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "employees_db",
  },
  console.log(`Connected to employee database`)
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
    :::::::::..:::::..:::::..::..:::::..:::......:::..::::..::........::..:::::..::::: `
);

const startApp = async () => {
  try {
    const ans = await inquirer.prompt({
      type: "list",
      name: "wtd",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee Role",
        "Quit",
      ],
    });
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
        process.exit();
    }
  } catch (err) {
    console.log(err);
  }
};

async function viewAllDepartments() {
  const [departments] = await db.promise().query("select * from department");
  console.table(departments);
  startApp();
}
async function viewAllRoles() {
  const [roles] = await db.promise().query("select * from role");
  console.table(roles);
  startApp();
}
async function viewAllEmployees() {
  console.log("test");
  try {
    const [employees] = await db.promise().query("select * from employee");
    console.table(employees);
    startApp();
  } catch (err) {
    console.log(err);
  }
}

async function addDepartment() {
  const ans = await inquirer.prompt({
    type: "input",
    name: "department",
    message: "What department would you like to add?",
  });
  await db
    .promise()
    .query(`INSERT INTO department (name) VALUES ('${ans.department}')`);
  viewAllDepartments();
}

async function addEmployee() {
  const [roles] = await db.promise().query("select * from role");
  const [employees] = await db.promise().query("select * from employee");
  console.log(employees);
  const ans = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "What is your first name?",
    },
    {
      type: "input",
      name: "last_name",
      message: "What is your last name?",
    },
    {
      type: "list",
      name: "role_id",
      message: "Please choose from one of the roles below",
      choices: roles.map(({ title, id }) => ({
        name: title,
        value: id,
      })),
    },
    {
      type: "list",
      name: "manager_id",
      message: "Who is the employee's manager?",
      choices: employees.map(({ first_name, last_name, id }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      })),
    },
  ]);
  console.log(ans);
  await db
    .promise()
    .query(
      `INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ('${ans.first_name}','${ans.last_name}', ${ans.role_id}, ${ans.manager_id})`
    );
  viewAllEmployees();
}
async function addRole() {
  const [departments] = await db.promise().query("select * from department");
  const ans = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What is the title of the new role?",
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of this new role?",
    },
    {
      type: "list",
      name: "department",
      message: "What department is the new role in?",
      choices: departments.map(({ name, id }) => ({
        name: name,
        value: id,
      })),
    },
  ]);
  console.log(ans);
  await db
    .promise()
    .query(
      `INSERT INTO role (title,salary,department_id) VALUES ('${ans.title}', '${ans.salary}', '${ans.department}')`
    );
  viewAllRoles();
}

async function updateEmployee() {
  const [employees] = await db.promise().query("select * from employee");
  const [roles] = await db.promise().query("select * from role");
  const ans = await inquirer.prompt([
    {
      type: "list",
      name: "employee",
      message: "Which employee would you like to change the role of?",
      choices: employees.map(({ first_name, last_name, id }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      })),
    },
    {
      type: "list",
      name: "role",
      message: "What role would you like to reassign them to?",
      choices: roles.map(({ title, id }) => ({
        name: title,
        value: id,
      })),
    },
  ]);
  await db
    .promise()
    .query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${ans.first_name}','${ans.last_name}', ${ans.role_id}, ${ans.manager_id})`
    );
  viewAllEmployees();
}

startApp();
