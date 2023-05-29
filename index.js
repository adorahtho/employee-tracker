const inquirer = require('inquirer')
const fs = require('fs')

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