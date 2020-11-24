const express = require('express');
const router = express.Router();
var registrations = require('./fabric-registrations');
var ehr_invoke = require('./ehr-invokes');
var ehr_query = require('./ehr-queries');
var mysql      = require('mysql');


const accountSid = "AC864d710b56cc4ac036dab867c7690251";
const authToken = "4b47ce5cdee2c0c10a9151aa0632ab6b";
const client = require('twilio')(accountSid, authToken);
const from_number ="+12283359090";

var connection = mysql.createConnection({
  host     : "localhost",
  user     : "root",
  password : "password",
  database : "ehr_data"
});
 
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});



function sqlInsert(user_name, password, secret_code, code_created_date, user_role,mobile_num){
   
    var sql = "INSERT INTO patient_details (user_name, password, secret_code, code_created_date, user_role,mobile_number) VALUES ('"+user_name+"','"+password+"','"+secret_code+"','"+code_created_date+"','"+user_role+"','"+mobile_num+"')";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("record inserted");
    });

}


/* 
    Purpose  : To register admin in the network
    Type     : POST
    Inputs   : None
    Response : standard
    DB Call  : INSERT 

*/
router.post('/register-admin/', (req, res, next) => {
    console.log(req.body)
    console.log(
        {
            "body":req.body,    
            "call":"register_admin"
        }
    );

    registrations.registerAdmin(req.body.admin_name,req.body.org_name).then(data=>{
        
        console.log("data=====>",data);
        
        sqlInsert(req.body.user_name,req.body.password,req.body.secret_code,req.body.code_created_date,req.body.user_role,req.body.mobile_num);

        res.status(200).json(
            {
                "doc":data,
                "msg": "Admin Registered Successfully"
            }
        );
        
        })
    
});


/* 
    Purpose  : To Register User in the network
    Type     : POST
    Inputs   : None
    Response : standard
    DB Call  : INSERT 

*/
router.post('/register-user/', (req, res, next) => {
    console.log(
        {
            "body":req.body,
            "call":"register-user"
        }
    );

    registrations.registerUser(req.body.admin_name,req.body.user_name,req.body.user_role,req.body.org_name).then(data=>{
            
        console.log("data=====>",data);
        sqlInsert(req.body.user_name,req.body.password,req.body.secret_code,req.body.code_created_date,req.body.user_role,req.body.mobile_num);
        res.status(200).json(
            {
                "doc":data,
                "msg": "User Registered Succesfully"
            }
        );
    })
});



/* 
    Purpose  : To register user in the network
    Type     : POST
    Inputs   : None
    Response : standard
    DB Call  : NONE

*/
router.post('/login',(req,res)=>{
    // User credentials to check if the user is authenticated or not.
    const user_name =  req.body.user_name;
    const password = req.body.password;
    
    connection.query("SELECT * FROM patient_details WHERE user_name='"+user_name+"' and password='"+password+"'", function (err, result, fields) {
        if (err){
            res.status(200).json(
                {
                    "code":-1,
                    "msg": "User Not Found"
                }
            );

        }
        else{
            res.status(200).json(
                {
                    "code":1,
                    "msg": "User Found"
                }
            );
    
        } 
      });
    

})


/* 
    Purpose  : To register user in the network
    Type     : POST
    Inputs   : None
    Response : standard
    DB Call  : NONE

*/
router.post('/create-otp',(req,res)=>{
    // User credentials to check if the user is authenticated or not.
    const user_name =  req.body.user_name;
    const password = req.body.password;
    let date = Date.now();
    let otp = Math.random().toString(36).substring(7);

    
    connection.query("SELECT * FROM patient_details WHERE user_name='"+user_name+"' and password='"+password+"'", function (err, result, fields) {
        if (err){
         console.log(err);   
        }
        else{
            console.log(result[0]["mobile_number"]);
                client.messages
                .create({
                    body: "OTP to access"+user_name+"'s file is "+otp+"",
                    from: from_number,
                    to: result[0]["mobile_number"]
                })
                .then(message => console.log(message.sid));

                // res.status(200).json(
                //     {
                //         "code":1,
                //         "msg": "OTP sent to registered mobile"
                //     }
                // );
                
            } 
        });
        connection.query("UPDATE patient_details SET secret_code = '"+otp+"',code_created_date='"+date+"' WHERE user_name = '"+user_name+"'", function (err, result, fields) {
        if (err){
            res.status(200).json(
                {
                    "code":-1,
                    "msg": "OTP Failed to send"
                }
            );

        }
        else{
            
        }



})

})


/* 
    Purpose  : To register user in the network
    Type     : POST
    Inputs   : None
    Response : standard
    DB Call  : NONE

*/
router.post('/verify-otp',(req,res)=>{
    // User credentials to check if the user is authenticated or not.
    const user_name =  req.body.user_name;
    const password = req.body.password;
    const otp = req.body.otp;
    
    connection.query("SELECT * FROM patient_details WHERE user_name='"+user_name+"' and password='"+password+"'", function (err, result, fields) {
        if (err){
            console.log("verify-otp-err",err);            
        }
        else{
            if (result[0]["secret_code"] == otp){
                    console.log("success!!!!!!!!!!!!!!!!!!!!!");
            }
        } 
      });
    

})







  module.exports = router;
