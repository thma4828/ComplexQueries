var fs = require('fs');

var fmod2 = function(q){
    fs.appendFile('querylog.txt', '\n', function(err){
        if(err) throw err;
        console.log("newline created in log");
    });
    fs.appendFile('querylog.txt', q, function(err){
        if(err) throw err;
        console.log(q, " has been saved to querylog");
    });
    return 0;
};

module.exports = fmod2;
