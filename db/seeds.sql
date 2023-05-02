USE employees_db;
INSERT INTO department (name)
VALUES ("Sales"),
("Engineering"),
("Finance"),
("Legal")
;

INSERT INTO role (title,salary,department_id)
VALUES ("Sales Lead", 160000,1),
("Lead Engineer", 200000,2),
("Salesperson", 300000,1),
("Software Engineer", 100000,2),
("Accountant", 100000,3),
("Legal Team Lead", 100000,4),
("Lawyer", 100000,4),
("Account Manager", 2000000,3);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Anna", "Riley"),
("Veronica, Griggs");