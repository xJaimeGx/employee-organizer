const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const util = require('util');

// Create the connection to the database
let connection = mysql2.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee'
});

connection.query = util.promisify(connection.query);

// Start app
connection.connect(function (err) {
    if (err) throw err;
    startApp();
});

// Begin with title
console.table(
    "\n** MARVEL Employee Organizer **\n"
);

// Ask the user what they want to do
const startApp = async () => {
    try {
        let answer = await inquirer.prompt({
            name: 'action',
            type: 'list',
            message: 'Choose an option.',
            choices: [
                'View Employees',
                'View Departments',
                'View Roles',
                'Add Employees',
                'Add Departments',
                'Add Roles',
                'Update Employee Role',
                'Exit'
            ]
        });
        switch (answer.action) {
            case 'View Employees':
                viewEmployee();
                break;

            case 'View Departments':
                viewDept();
                break;

            case 'View Roles':
                viewRole();
                break;

            case 'Add Employees':
                addEmployee();
                break

            case 'Add Departments':
                addDept();
                break

            case 'Add Roles':
                addRole();
                break

            case 'Update Employee Role':
                updateEmployee();
                break

            case 'Exit':
                connection.end();
                break;
        };
    } catch (err) {
        console.log(err);
        startApp();
    };
};

// View all employees.
const viewEmployee = async () => {
    console.log('Employees');
    try {
        let query = 'SELECT * FROM employees';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let employeeArray = [];
            res.forEach(employee => employeeArray.push(employee));
            console.table(employeeArray);
            startApp();
        });
    } catch (err) {
        console.log(err);
        startApp();
    };
};

// View all departments.
const viewDept = async () => {
    console.log('Departments');
    try {
        let query = 'SELECT * FROM departments';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let departmentArray = [];
            res.forEach(department => departmentArray.push(department));
            console.table(departmentArray);
            startApp();
        });
    } catch (err) {
        console.log(err);
        startApp();
    };
};

// View all roles.
const viewRole = async () => {
    console.log('Roles');
    try {
        let query = 'SELECT * FROM roles';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let roleArray = [];
            res.forEach(role => roleArray.push(role));
            console.table(roleArray);
            startApp();
        });
    } catch (err) {
        console.log(err);
        startApp();
    };
};

// Add a new employee
const addEmployee = async () => {
    try {
        console.log('Employees');
        let roles = await connection.query("SELECT * FROM roles");
        let managers = await connection.query("SELECT * FROM employees");
        let answer = await inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'What is the new employees first name?'
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'What is the new employees last name?'
            },
            {
                name: 'employeeRoleId',
                type: 'list',
                choices: roles.map((role) => {
                    return {
                        name: role.title,
                        value: role.id
                    }
                }),
                message: "What is the ID oof the new employee?"
            },
            {
                name: 'employeeManagerId',
                type: 'list',
                choices: managers.map((manager) => {
                    return {
                        name: manager.first_name + " " + manager.last_name,
                        value: manager.id
                    }
                }),
                message: "What is the new employees manager ID?"
            }
        ])
        let result = await connection.query("INSERT INTO employees SET ?", {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: (answer.employeeRoleId),
            manager_id: (answer.employeeManagerId)
        });

        console.log(`${answer.firstName} ${answer.lastName} has been added.\n`);
        startApp();

    } catch (err) {
        console.log(err);
        startApp();
    };
};

// Add a new department.
const addDept = async () => {
    try {
        console.log('Departments');
        let answer = await inquirer.prompt([
            {
                name: 'deptName',
                type: 'input',
                message: 'Add the name of the new department.'
            }
        ]);
        let result = await connection.query("INSERT INTO departments SET ?", {
            department_name: answer.deptName
        });

        console.log(`${answer.deptName} department added.\n`)
        startApp();

    } catch (err) {
        console.log(err);
        startApp();
    };
};

// Add a new role.
const addRole = async () => {
    try {
        console.log('Roles');
        let departments = await connection.query("SELECT * FROM departments")
        let answer = await inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is the new role?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What will the salary be for this new role?'
            },
            {
                name: 'departmentId',
                type: 'list',
                choices: departments.map((departmentId) => {
                    return {
                        name: departmentId.department_name,
                        value: departmentId.id
                    }
                }),
                message: 'What will the department ID be for this role?',
            }
        ]);
        
        let deptChoice;
        for (i = 0; i < departments.length; i++) {
            if(departments[i].department_id === answer.choice) {
                deptChoice = departments[i];
            };
        }
        let result = await connection.query("INSERT INTO roles SET ?", {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.departmentId
        })

        console.log(`${answer.title} has been added.\n`)
        startApp();

    } catch (err) {
        console.log(err);
        startApp();
    };
};

// Update a role for an individual employee
const updateEmployee = async () => {
    try {
        console.log('Employees');        
        let employees = await connection.query("SELECT * FROM employees");
        let indEmployee = await inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                choices: employees.map((employeeName) => {
                    return {
                        name: employeeName.first_name + " " + employeeName.last_name,
                        value: employeeName.id
                    }
                }),
                message: 'Choose an employee that you would like to update.'
            }
        ]);
        let roles = await connection.query("SELECT * FROM roles");
        let roleChoice = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: roles.map((roleName) => {
                    return {
                        name: roleName.title,
                        value: roleName.id
                    }
                }),
                message: 'Please select the role to update the employee with.'
            }
        ]);
        let result = await connection.query("UPDATE employees SET ? WHERE ?", [{ role_id: roleChoice.role }, { id: indEmployee.employee }]);

        console.log(`Role has been updated.\n`);
        startApp();

    } catch (err) {
        console.log(err);
        startApp();
    };
};