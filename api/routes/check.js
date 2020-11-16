var test_data = [
    {"instance_id":"001","timestamp":3},
    {"instance_id":"001","timestamp":2},
    {"instance_id":"001","timestamp":1},
    {"instance_id":"001","timestamp":4},
    {"instance_id":"002","timestamp":5},
    {"instance_id":"002","timestamp":7},
    {"instance_id":"002","timestamp":6},
    {"instance_id":"002","timestamp":8},
    {"instance_id":"003","timestamp":10},
    {"instance_id":"003","timestamp":9}
]

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