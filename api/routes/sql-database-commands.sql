CREATE DATABASE ehr_data;

CREATE TABLE patient_details (user_name VARCHAR(25), password VARCHAR(25), secret_code VARCHAR(15), code_created_date VARCHAR(15), user_role VARCHAR(10), mobile_number VARCHAR(15));

INSERT INTO patient_details (user_name,password,secret_code,code_created_date,user_role,mobile_number) VALUES ('John','f9s0df','','','client','+919550119531');