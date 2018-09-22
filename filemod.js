var fs = require('fs');

var funcMod = function(fdata){
    fs.writeFileSync('htmlLog.txt', fdata);
    return 0;
};

module.exports = funcMod;