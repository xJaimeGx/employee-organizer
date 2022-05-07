INSERT INTO departments (department_name)
VALUES
  ("Mercenary"),
  ("Espionage"),
  ("Intelligence"),
  ("Trainee");

SELECT * FROM departments;

INSERT INTO roles (title, salary, department_id)
VALUES
  ("Commander", 750000, 1),
  ("Sergeant", 500000, 1),
  ("Private", 250000, 1),
  ("Executive", 600000, 2),
  ("Agent", 400000, 2),
  ("Recon", 150000, 2),
  ("Head Professor", 500000, 3),
  ("Lead Scientist", 250000, 3),
  ("Scientist", 100000, 3),
  ("Intern", 50000, 4);

SELECT * FROM roles;

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
  ("Dead", "Pool", 1, NULL),
  ("Spider", "Man", 4, 1),
  ("Black", "Widow", 2, 2),
  ("Iron", "Man", 1, NULL),
  ("Captain", "Marvel", 1, 1),
  ("Doctor", "Strange", 3, 2);

SELECT * FROM employees;