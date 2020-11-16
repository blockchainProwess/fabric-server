const express = require('express');
const router = express.Router();
var registrations = require('./fabric-registrations');
var ehr_invoke = require('./ehr-invokes');
var ehr_query = require('./ehr-queries');



/* 
    Purpose  : To invoke the chaincode
    Type     : POST
    Inputs   : None
    Response : standard
    DB Call  : INSERT 

*/
router.post('/invoke/', (req, res, next) => {
    console.log(
        {
            "body":req.body,
            "call":"invoke"
        }
    );
    
    
    ehr_invoke.common_invoke(req.body.chain_code_name,req.body.user_name,req.body.func_name,req.body.args).then(data=>{
        console.log("data=====>",data);       
        res.status(200).json(
                {
                    "doc":data,
                    "msg": "invoke successful"
                }
            );
    
    
    })

    


});




/* 
    Purpose  : To Query the Assets latest information.
    Type     : POST
    Inputs   : None
    Response : JSON 

*/
router.post('/querytransaction/', (req, res, next) => {
    console.log(
        {
            "body":req.body,
            "call":"query"
        }
    );

    
    ehr_query.common_query(req.body.chain_code_name,req.body.user_name,"queryTransaction",req.body.args).then(data=>{
        
        console.log("data=====>",data);
    
        if(data != null)
        {
            res.status(200).json(
                {
                    "doc":data,
                    "msg": "Query success"
                }
            );
        } else {
            res.status(200).json(
                {
                    "doc":{'response':'Asset Not Found'},
                    "msg": "Query success"
                }
            );
        }
        

    })

    

});


/* 
    Purpose  : To Query the Assets history information.
    Type     : POST
    Inputs   : None
    Response : JSON 

*/
router.post('/patient-disease-history/', (req, res, next) => {
    console.log(
        {
            "body":req.body,
            "call":"patient-disease-history"
        }
    );
    
   


    ehr_query.common_query(req.body.chain_code_name,req.body.user_name,"queryTransactionHistory",req.body.args).then(data=>{
        
        console.log("data=====>",data);
        
        if(data != null)
        {

            patient_disease_history = []

            var instance_id_array = [];

            for (var i=0;i<test_data.length;i++){
                instance_id_array.push(test_data[i]["instance_id"])
            }
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }
            var unique = instance_id_array.filter(onlyUnique);
            for (var i=0;i<unique.length;i++){
                patient_disease_history.push([])
                for (var j=0;j<test_data.length;j++){
                    if (test_data[j]["instance_id"] == unique[i]){
                        patient_disease_history[i].push(test_data[j])
                    }
                }    
            }

            function sort(j){
                patient_disease_history[j].sort((a, b) => {
                    return a.timestamp - b.timestamp;
                });
            }

            var d = [];
            for (var j=0;j<patient_disease_history.length;j++){
                sort(j)
                    
            }

            console.log(patient_disease_history)


            res.status(200).json(
                {
                    "doc":data,
                    "msg": "Query success"
                }
            );
        } else {
            res.status(200).json(
                {
                    "doc":{'response':'Asset Not Found'},
                    "msg": "Query success"
                }
            );
        }
        

    })

    

});





module.exports = router;

