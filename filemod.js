var fs = require('fs');

var funcMod = function(fdata){
    fs.writeFileSync('htmlLog.txt', fdata);

    fs.appendFile('htmlLog.txt', '\n', function(err){
        if(err) throw err;
        console.log("newline created in htmllog");
    });
    fs.appendFile('htmlLog.txt', fdata, function(err){
        if(err) throw err;
        console.log("html data has been saved to htmllog");
    });
    return 0;
};

module.exports = funcMod;