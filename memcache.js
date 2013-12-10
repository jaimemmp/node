// 'use strict';

var obj = {};

var net = require('net');
var port = 11311;

var server = net.createServer(function(connection) {
    console.log('Connection open\r\n');
    connection.write('Hello?\r\n');
    connection.on('data', function(data) {
        
        var pieces = String(data).trim().split(' ');
        
        if (pieces[0] == 'set') {
            if (pieces.length()==3){
                var newkey = pieces[1];
                var newvalue = pieces[2];
                obj[newkey] = newvalue;
                if (obj[newkey]==newvalue){
                    connection.write('STORED\r\n');
                }else{
                    connection.write('NOT_STORED\r\n');
                }
            } else {
                connection.write('ERROR. WRONG FORMAT FOR SET. 2 PARAMETERS NEEDED [key] [value]\r\n');
            }

        } else if (pieces[0] == 'get') {
            if (pieces.length()==2){
                var key = pieces[1];
                if (key in obj) {
                    connection.write('VALUE '+key+' '+obj[key]+'\r\n');
                } else {
                    connection.write('ERROR\r\n');
                }
            } else {
                connection.write('ERROR. WRONG FORMAT FOR GET. 1 PARAMETER NEEDED [key]\r\n');
            }

        } else if (pieces[0] == 'delete') {
            if (pieces.length()==2){
                var oldkey = pieces[1];
                if (oldkey in obj){
                    delete obj[oldkey];
                    connection.write('DELETED\r\n');
                } else {
                    connection.write('NOT_FOUND\r\n');
                }
            } else {
                connection.write('ERROR. WRONG FORMAT FOR DELETE. 1 PARAMETER NEEDED [key]\r\n');
            }

        } else {
            connection.write('ERROR\r\n');
        }
    });
});
server.listen(port);