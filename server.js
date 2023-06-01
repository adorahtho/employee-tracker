// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer')
const cTable = require('console.table')

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

function init() {
  inquirer.prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'options',
      choices: [
        {
          name: 'View All Departments',
          value: 'VIEW_ALL_DEPARTMENTS'
        },
        {
          name: 'View All Roles',
          value: 'VIEW_ALL_ROLES'
        },
        {
          name: 'View All Employees',
          value: 'VIEW_ALL_EMPLOYEES'
        },
        {
          name: 'Add A Department',
          value: 'ADD_A_DEPARTMENT'
        },
        {
          name: 'Add A Role',
          value: 'ADD_A_ROLE'
        },
        {
          name: 'Add An Employee',
          value: 'ADD_AN_EMPLOYEE'
        },
        {
          name: 'Update An Employee Role',
          value: 'UPDATE_AN_EMPLOYEE_ROLE'
        }
      ]
    }
  ])
  .then((choice) => {
    console.log(choice)
    switch (choice.options) {
      case 'VIEW_ALL_DEPARTMENTS':
        viewAllDepartments();
        break;
      case 'VIEW_ALL_ROLES':
        viewAllRoles();
        break;
      case 'VIEW_ALL_EMPLOYEES':
        viewAllEmployees();
        break;
      case 'ADD_A_DEPARTMENT':
        addADepartmet();
        break;
      case 'ADD_A_ROLE':
        addARole();
        break;
      case 'ADD_AN_EMPLOYEE':
        addAnEmployee();
        break;
      case 'UPDATE_AN_EMPLOYEE_ROLE':
        updateAnEmployeeRole();
        break;
    }
  })
}

function viewAllDepartments() {
  db.query('SELECT * FROM departments', function (err, results) {
    if (err) {
      console.log(err);
    }
    console.table(results);
  })
  init()
}

function viewAllRoles() {
  db.query('SELECT * FROM role', function (err, results) {
    if (err) {
      console.log(err);
    }
    console.table(results);
  })
  init()
}
// need to correct spacing in terminal as prompts appear on top instead of on bottom and pushes the titles of the columns to the right when viewing all roles

init()