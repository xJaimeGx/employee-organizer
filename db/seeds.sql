INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
  ("Dead", "Pool", 1, NULL),
  ("Spider", "Man", 4, 1),
  ("Black", "Widow", 2, 2),
  ("Iron", "Man", 1, NULL),
  ("Captain", "Marvel", 1, 1),
  ("Doctor", "Strange", 3, 2);

SELECT * FROM employees;