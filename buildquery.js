model.exports = function(byName, byID, ident, rcid, rcompname, rname, rcity, rphone, raddr, rfax, rorders){
    var query = "select ";
    if(this.byID == 1){
        if(rcid && rcompname && rname && rcity && rphone && raddr && rfax &&rorders){
            query = query + "* from nwcustomers where CustomerID = " + "'" + ident + "'" + ";";
        }else{
            //about a trillion cases....
        }
        //hypothetically query string is built now. 
        return query;
    //}else{

    //}
}
