var fs  = require("fs");

var input;
var ans;
var solution;

var resout;
var index;

exports.check = function(_input , _ans, _sol, callback) {
	//load files
	try {
		input = fs.readFileSync(_input).toString().split('\n');
		ans = fs.readFileSync(_ans).toString();
		solution = fs.readFileSync(_sol).toString();
	} catch(e){
		throw e;
	}

	//reset vars
	index = 0;
	resout = "";

	//evaluate solution
	eval(solution);

	var passed = (ans == resout)

	callback(passed, input, ans, solution, resout);
}

/*
	kattis functions
*/
function readline(){
	return input[index++];
}

function print(v){
	resout += v + "\n";
}