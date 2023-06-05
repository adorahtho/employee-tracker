-- -- View All Departments
-- SELECT department.id, department.name;

-- View All Employees
-- SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS Department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
-- FROM employee
-- INNER JOIN role
-- ON employee.role_id = role.id
-- INNER JOIN department
-- ON role.department_id = department.id
-- LEFT JOIN employee AS manager
-- ON employee.manager_id = manager.id
-- ORDER BY employee.id ASC;




