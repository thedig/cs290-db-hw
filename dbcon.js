var mysql = require('mysql');

var osu = {
	connectionLimit : 10,
	host            : 'classmysql.engr.oregonstate.edu',
	user            : 'cs290_vargassa', 	// replace YOURONID with your ONID u/n (what comes before @oregonstate.edu for your email/login credentials)
	password        : '6449',	// replace with your password -- if left as the default, it should be the last 4 digits of your student ID
	database        : 'cs290_vargassa'	// see comment for 'user' key above
};

var pool = mysql.createPool(osu);

module.exports.pool = pool;
