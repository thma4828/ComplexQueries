var mysql = require('mysql');
var express = require('express');
var app = express();
var fs = require('fs');
var funcMod = require('./filemod');


//create connection variable with mySQL module.
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rythmic8480',
    database: 'northwinds'
});

con.connect(function(err) {
        if(err) throw err;
        console.log('connection to northwinds successful');
});

//default get request to myip:8080/
app.get('/', function(req, res) {
        res.sendFile("C:/Users/tsmar/Desktop/ComplexQueries/comp.html");
});

//for first query from comp.html 
app.get('/query_one', function(req, res) {
    var tableName = req.query.TableName;
    console.log(tableName);
    switch(tableName){
        case "orders":
            res.sendFile("C:/Users/tsmar/Desktop/ComplexQueries/comp2.html");
            //res.end();
            break;
        case "customers":
            res.sendFile("C:/Users/tsmar/Desktop/ComplexQueries/comp3.html");
            //res.end();
            break;
        case "employees":
            res.sendFile("C:/Users/tsmar/Desktop/ComplexQueries/comp4.html");
            //res.end();
            break;
        default:
            res.end();
    }
});

app.get('/query_one_b', function(req, res){
    var include_oid = req.query.OID;
    var include_cid = req.query.CID;
    var include_od = req.query.OD;
    var include_freight = req.query.FR;
    var all = 0;
    var order_by_freight = req.query.OBF;
    var desc = req.query.DESC;
    var mFreight = req.query.MF;
    console.log(include_oid, include_cid, include_od, include_freight, order_by_freight, desc, mFreight);
    var s1 = "select ";
    if(!(include_oid && include_cid && include_od && include_freight)){
        if(include_oid && (include_cid || include_od || include_freight)){
            s1 += "OrderID, ";
        }else if(include_oid && !(include_cid || include_od)){
            s1 += "OrderID ";
        }

        if(include_cid && (include_od || include_freight)){
            s1 += "CustomerID, ";
        }else if(include_cid && !(include_od || include_freight)){
            s1 += "CustomerID ";
        }

        if(include_od && include_freight){
            s1 += "OrderDate, ";
        }else if(include_od && !include_freight){
            s1 += "OrderDate ";
        }

        if(include_freight){
            s1 += "Freight ";
        }



    }else{
        s1 += "* ";
        all = 1;
    }

    console.log("query string so far constructed: ", s1);

    var specify_sc = req.query.SSC;
    var ship_c = ' ';
    var minS=' ';
    var maxS=' ';
    var minint = -1;
    var maxint = -1;
    var specify_fr = req.query.LBF;
    if(specify_sc){
        ship_c = req.query.ShipCountry;
    }
    if(specify_fr){
        minS = req.query.minf;
        maxS = req.query.maxf;
        minint = parseInt(minS);
        maxint = parseInt(maxS);
    }
    if(specify_sc && !specify_fr){
        s1 += "from nworders where ShipCountry = ";
        s1 += "'" + ship_c + "'";
    }
    if(specify_sc && specify_fr){
        s1 += "from nworders where ShipCountry = ";
        s1 += "'" + ship_c + "'";
        
        s1 += " and ";
        s1 += "Freight > " + minint +" and Freight < " + maxint;
    }
    if(specify_fr && !specify_sc){
        s1 += "from nworders where Freight >= " + minint + " and Freight <= " + maxint;
    }
    if(!specify_fr && !specify_sc){
        s1 += "from nworders";
    }
    if(order_by_freight && desc){
        s1 += " order by Freight desc;";
    }
    if(order_by_freight && !desc){
        s1 += " order by Freight;";
    }
    if(desc && !order_by_freight){
        s1 += ";";
        console.log("bad case: user tried to order by desc but not by freight, ");
    }
    console.log("query string so far |", s1, "|");
    con.query(s1, function(err, rows, fields){
        if(err) throw err;
        var response_ = '<h1>results of query listed below</h1><br>';
        response_ += '<br><br><form action="http://127.0.0.1:8080/" method="get"><input type="submit" value="click here to try another query." name="Submit2" id="frm2_submit" /></form><br>';

        var length = rows.length;
        if(all == 1){ //if we chose to select all fields. this is the easy case
            for(j=0; j<length; j++){
                response_ += '<br>';
                response_ += '<h3>The Order ID: </h3>' + rows[j].OrderID +'<br>';
                response_ += '<h3>The Customer ID: </h3>' + rows[j].CustomerID + '<br>';
                response_ += '<h3>The Order Date: </h3>' + rows[j].OrderDate + '<br>';
                response_ += '<h3>Freight: </h3>' + rows[j].Freight + '<br>';
            }
            
        }else{ //some variation of the 14 ways we could combine any subset of the elements. 
            if(include_oid && include_cid && include_od && !include_freight){ //1
                for(j=0; j<length; j++){
                    response_ += '<br>';
                    response_ += '<h3>The Order ID: </h3>' + rows[j].OrderID +'<br>';
                    response_ += '<h3>The Customer ID: </h3>' + rows[j].CustomerID + '<br>';
                    response_ += '<h3>The Order Date: </h3>' + rows[j].OrderDate + '<br>';
                }
                

            }else if(include_oid && include_cid && !include_od && !include_freight){ //2
                   for(j=0; j<length; j++){
                    response_ += '<br>';
                    response_ += '<h3>The Order ID: </h3>' + rows[j].OrderID +'<br>';
                    response_ += '<h3>The Customer ID: </h3>' + rows[j].CustomerID + '<br>';
                    
                }
             
            }else if(include_oid && !include_cid && !include_od && !include_freight){ //3
                for(j=0; j<length; j++){
                    response_ += '<br>';
                    response_ += '<h3>The Order ID: </h3>' + rows[j].OrderID +'<br>';
                }
               

            }else if(include_oid && include_cid && !include_od && include_freight){ //4
                for(j=0; j<length; j++){
                    response_ += '<br>';
                    response_ += '<h3>The Order ID: </h3>' + rows[j].OrderID +'<br>';
                    response_ += '<h3>The Customer ID: </h3>' + rows[j].CustomerID + '<br>';
                    response_ += '<h3>Freight: </h3>' + rows[j].Freight + '<br>';
                }
              
            
            }else if(!include_oid && include_cid && include_od && include_freight){ //5
                for(j=0; j<length; j++){
                    response_ += '<br>';
                    response_ += '<h3>The Customer ID: </h3>' + rows[j].CustomerID + '<br>';
                    response_ += '<h3>The Order Date: </h3>' + rows[j].OrderDate + '<br>';
                    response_ += '<h3>Freight: </h3>' + rows[j].Freight + '<br>';
                }
            

            }else if(include_oid && !include_cid && include_od && include_freight){ //6
                for(j=0; j<length; j++){
                    response_ += '<br>';
                    response_ += '<h3>The Order ID: </h3>' + rows[j].OrderID +'<br>';
                    response_ += '<h3>The Order Date: </h3>' + rows[j].OrderDate + '<br>';
                    response_ += '<h3>Freight: </h3>' + rows[j].Freight + '<br>';
                }
            
            }else if(!include_oid && include_cid && !include_od && !include_freight){ //7
                for(j=0; j<length; j++){
                    response_ += '<br>';
                    response_ += '<h3>The Customer ID: </h3>' + rows[j].CustomerID + '<br>';
                }
              
            }else if(!include_oid && !include_cid && include_od && !include_freight){ //8
                for(j=0; j<length; j++){
                    response_ += '<br>';
                    response_ += '<h3>The Order Date: </h3>' + rows[j].OrderDate + '<br>';
                }
                
            }else if(!include_oid && !include_cid && !include_od && include_freight){ //9
                for(j=0; j<length; j++){
                    response_ += '<h3>Freight: </h3>' + rows[j].Freight + '<br>';
                }
              
            }else if(!include_oid && include_cid && !include_od && include_freight){ //10
                for(j=0; j<length; j++){
                    response_ += '<h3>The Customer ID: </h3>' + rows[j].CustomerID + '<br>';
                    response_ += '<h3>Freight: </h3>' + rows[j].Freight + '<br>';   
                }
            
            }else if(include_oid && !include_cid && include_od && !include_freight){ //11
                for(j=0; j<length; j++){
                    response_ += '<h3>The Order ID: </h3>' + rows[j].OrderID +'<br>';
                    response_ += '<h3>The Order Date: </h3>' + rows[j].OrderDate + '<br>';
                }
            
            }else if(include_oid && !include_cid && !include_od && include_freight){ //12
                for(j=0; j<length; j++){
                    response_ += '<h3>The Order ID: </h3>' + rows[j].OrderID +'<br>';
                    response_ += '<h3>Freight: </h3>' + rows[j].Freight + '<br>';   
                }
                
            }else if(!include_oid && include_cid && include_od && !include_freight){ //13
                for(j=0; j<length; j++){
                    response_ += '<h3>The Customer ID: </h3>' + rows[j].CustomerID + '<br>';
                    response_ += '<h3>The Order Date: </h3>' + rows[j].OrderDate + '<br>';
                }
               
            }else if(!include_oid && !include_cid && include_od && include_freight){ //14, which is = C(4,3) + C(4,2,) + C(4,1) = 14!
                    for(j=0; j<length; j++){
                        response_ += '<h3>The Order Date: </h3>' + rows[j].OrderDate + '<br>';
                        response_ += '<h3>Freight: </h3>' + rows[j].Freight + '<br>';   
                    }
                   
            }
            
        }
        freight_array = [];
        if(mFreight && include_freight){
            var mean_f = 0.0;
            for(p=0; p<length; p++){
                var fr = parseFloat(rows[p].Freight);
                mean_f += fr;
                freight_array.push(fr);
            }
            var tnf = req.query.TNF;
            var n = parseInt(req.query.N);

            
            mean_f = mean_f / length;
            console.log(" the mean freight is: ", mean_f);
          
            response_ += '<h2>The Mean Freight: </h3>' + mean_f + '<br>';
            resp2 = '<br><h2>last ' + n + ' freight values:</h2><br>';
            if(tnf && (n < length)){
                for(z=0; z<n; z++){
                    resp2 += '<h3>freight #' + (z+1) + ' = ' + rows[z].Freight + '</h3><br>';
                }
                response_ += resp2;
            }else if(n >= length){
                console.log("error: user trying to print too many freight values")
            }
            
        }else if(mFreight && !include_freight){
            console.log("error: user trying to calculate mean freight, but didn't include freight in the query.");
        }else if(req.query.TNF && !include_freight){
            console.log("error: user trying to print the last N freight values, but didn't include freight in the query");
        }
           
        response_ += '<br><br><form action="http://127.0.0.1:8080/" method="get"><input type="submit" value="click here to try another query." name="Submit" id="frm1_submit" /></form><br>';
        funcMod(response_); //this is my module stored in filemod.js that logs the most recent html query result to a file on the server. 
        res.send(response_);
        console.log("resulting html logged to htmlLog.txt");
        console.log("number of query results returned: ", length);
    });
});

var server = app.listen(8080, function() {
    console.log("theos node.js web server listening on port: 8080 @ 127.0.0.1");
});
