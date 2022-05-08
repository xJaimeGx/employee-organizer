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