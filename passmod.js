 var f = function fpass(){
                var p = document.getElementByID("pk55");
                if(p.type === "password"){
                    p.type = "text";
                }else{
                   p.type = "password";
                }
}

module.exports = f;
   
