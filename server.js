// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer')
const {printTable} = require('console-table-printer')

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
  const sql = `SELECT * FROM departments`;
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }
    printTable(res);
    init()
  })
}

function viewAllRoles() {
  const sql = `SELECT role.title AS job_title, 
  role.id AS Role_Id, 
  departments.name AS Department, 
  role.salary 
  FROM role JOIN departments ON role.department_id = departments.id`;
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }
    printTable(res);
    init()
  })
}

function viewAllEmployees() {
  const sql = `SELECT employee.id AS Id, 
  CONCAT(employee.first_name, " ", employee.last_name) AS Name, 
  role.title AS Title, 
  role.salary AS Salary, 
  departments.name AS Department, 
  CONCAT(manager.first_name, ' ', manager.last_name) AS Manager 
  FROM employee LEFT JOIN role ON employee.id = role.id 
  LEFT JOIN departments ON role.department_id = departments.id 
  LEFT JOIN employee manager on manager.id = employee.manager_id;`;
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }
    printTable(res);
    init()
  })
}

async function addADepartmet() {
  try {
    const {name} = await inquirer.prompt({
      type: 'input', 
      name: 'name', 
      message: 'Enter new department name.'
    })
    const [rows] = await db.promise().query(`INSERT INTO departments SET ?`, {name})
    if(rows.affectedRows > 0) {
      viewAllDepartments()
    }else {
      console.error({message: 'Failed to add to Database.'})
    }
  } catch (error) {
    console.error({message: 'Failed to ask question.'})
  }
}

async function addARole() {
  const [departments] = await db.promise().query('SELECT * FROM departments')
  const departmentArray = departments.map(department => (
    {
      name: department.name, 
      value: department.id
    }
  ))
  inquirer.prompt([
    {
      type: 'input', 
      name: 'title', 
      message: 'Enter the name of the new role.'
    },  
    {
      type: 'input', 
      name: 'salary', 
      message: 'Enter the new salary.'
    }, 
    {
      type: 'list', 
      name: 'department_id', 
      message: 'Select department from list.', 
      choices: departmentArray
    }
  ]).then(({title, salary, department_id}) => {
    const roleObject = {title, salary, department_id}
    db.promise().query('INSERT INTO role SET ?', roleObject)
    .then(([rows]) => {
      if(rows.affectedRows > 0) {
        viewAllDepartments()
      }else {
        console.error({message: 'Failed to add to Database.'})
      }
    })
  })
}

async function addAnEmployee() {
  
}

init()