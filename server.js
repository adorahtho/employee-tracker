// Import dependencies
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

//prompts displaying options for user
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
  //user's choice will run the following function then break
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
        addADepartment();
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

//display department table
function viewAllDepartments() {
  const sql = `SELECT * FROM department`;
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }
    printTable(res);
    init()
  })
}

//display role table
function viewAllRoles() {
  const sql = `SELECT role.title AS Job_Title, 
  role.id AS Role_Id, 
  department.name AS Department, 
  role.salary AS Salary
  FROM role JOIN department ON role.department_id = department.id`;
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }
    printTable(res);
    init()
  })
}

//display employee table
function viewAllEmployees() {
  const sql = `SELECT employee.id AS Id, 
  CONCAT(employee.first_name, " ", employee.last_name) AS Name, 
  role.title AS Title, 
  role.salary AS Salary, 
  department.name AS Department, 
  CONCAT(manager.first_name, ' ', manager.last_name) AS Manager 
  FROM employee LEFT JOIN role ON employee.id = role.id 
  LEFT JOIN department ON role.department_id = department.id 
  LEFT JOIN employee manager on manager.id = employee.manager_id;`;
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }
    printTable(res);
    init()
  })
}

//add new department name and then department table displays showing update
async function addADepartment() {
  try {
    const {name} = await inquirer.prompt({
      type: 'input', 
      name: 'name', 
      message: 'Enter new department name.'
    })
    const [rows] = await db.promise().query(`INSERT INTO department SET ?`, {name})
    if(rows.affectedRows > 0) {
      viewAllDepartments()
    }else {
      console.error({message: 'Failed to add to Database.'})
    }
  } catch (error) {
    console.error({message: 'Failed to ask question.'})
  }
}

//add new role, salary, and department. display role table to show updates.
async function addARole() {
  const [department] = await db.promise().query('SELECT name, id FROM department')
  const departmentArray = department.map(department => ({
    name: department.name, 
    value: department.id
  }))
  inquirer.prompt([
    {
      type: 'input', 
      name: 'title', 
      message: 'Enter the name of new role.'
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
        viewAllRoles()
      }else {
        console.error({message: 'Failed to add role to Database.'})
      }
    })
  })
}

//add new employee first and last name, role, and manager. display employee table to show update.
async function addAnEmployee() {
  const [roles] = await db.promise().query('SELECT id, title FROM role')
  const roleArray = roles.map(role => ({
    name: role.title, 
    value: role.id
  }))
  const [employees] = await db.promise().query('SELECT id, first_name, last_name FROM employee')
  const managerArray = employees.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`, 
    value: employee.id
  }))
  inquirer.prompt([
    {
      type: 'input', 
      name: 'first_name', 
      message: 'Enter the employee first name.'
    },  
    {
      type: 'input', 
      name: 'last_name', 
      message: 'Enter the employee last name.'
    }, 
    {
      type: 'list', 
      name: 'role_id', 
      message: 'Select employee role.', 
      choices: roleArray
    },
    {
      type: 'list',
      name: 'manager_id',
      message: 'Select manager for employee.',
      choices: managerArray
    }
  ])
  .then(({first_name, last_name, role_id, manager_id}) => {
    const employeeObject = {first_name, last_name, role_id, manager_id}
    db.promise().query('INSERT INTO employee SET ?', employeeObject)
    .then(([rows]) => {
      if(rows.affectedRows > 0) {
        const sql = `SELECT employee.id AS Id, 
        CONCAT(employee.first_name, ' ', employee.last_name) AS Name, 
        role.title AS Title, 
        role.salary AS Salary, 
        department.name AS Department, 
        CONCAT(manager.first_name, ' ', manager.last_name) AS Manager 
        FROM employee 
        LEFT JOIN role ON employee.role_id = role.id 
        LEFT JOIN department ON role.department_id = department.id 
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id`
        db.query(sql, (err, res) => {
          if (err) {
            console.log(err);
          }
          printTable(res);
          init()
        })
      }else {
        console.error({message: 'Failed to add employee to Database.'})
      }
    })
  })
}

//update an employee's role and show updates on table
async function updateAnEmployeeRole() {
  const [employees] = await db.promise().query('SELECT id, first_name, last_name FROM employee')
  const employeeArray = employees.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`, 
    value: employee.id
  }))
  const [roles] = await db.promise().query('SELECT id, title FROM role')
  const roleArray = roles.map(role => ({
    name: role.title, 
    value: role.id
  }))
  inquirer.prompt([
    {
      type: 'list', 
      name: 'employee', 
      message: 'Select employee to update.',
      choices: employeeArray
    },
    {
      type: 'list',
      name: 'role',
      message: 'Select new role for employee.',
      choices: roleArray
    }
  ])
  .then(({employee, role}) => {
    const employeeRoleObject = {role_id: role}
    const employeeUpdateSql = `UPDATE employee SET ? WHERE id = ${employee}`
    db.promise().query(employeeUpdateSql, employeeRoleObject)
    .then(([rows]) => {
      if(rows.affectedRows > 0) {
        const sql = `SELECT employee.id AS Id, 
        CONCAT(employee.first_name, ' ', employee.last_name) AS Name, 
        role.title AS Title, 
        department.name AS Department
        FROM employee 
        LEFT JOIN role ON employee.role_id = role.id 
        LEFT JOIN department ON role.department_id = department.id`
        db.query(sql, (err, res) => {
          if (err) {
            console.log(err);
          }
          printTable(res);
          init()
        })
      }else {
        console.error({message: 'Failed to update Database.'})
      }
    })
  })  
}

init()