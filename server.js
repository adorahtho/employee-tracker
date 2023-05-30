// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer')

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

const options = [
  {
    type: 'list',
    message: 'What would you like to do?',
    name: 'options',
    choices: ['View All Departments', 'View All Roles', 'View All Dmployees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role']
  },
]

function init() {
  inquirer.prompt(options)
}

init()