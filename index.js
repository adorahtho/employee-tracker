const inquirer = require('inquirer')
const fs = require('fs')

const options = [
  {
    type: 'list',
    message: 'What would you like to do?',
    name: 'options',
    choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
  },
]