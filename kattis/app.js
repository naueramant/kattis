#!/usr/bin/env node

var downloader = require("./core/download.js");
var kattisjson = require("./core/kattisjson.js");
var checker = require("./core/check.js");
var fs = require('fs-extra');
var chalk = require('chalk');

var arg1 = process.argv[2];
var arg2 = process.argv[3];

if (arg1 == "init" && arg2 != undefined) {
    if (doProblemExist(arg2))
        console.log("This problem has already been initialized");
    else
        downloader.download(arg2, function(err1) {
            if (!err1)
                kattisjson.generateJson(arg2, function(err2) {
                    if (!err2)
                        generateStartFiles(arg2, function(err3) {
                            if (!err3)
                                console.log(arg2 + " was successfully initialized");
                            else
                                console.log("Failed to generate solution.js");
                        });
                    else
                        console.log("Failed to generate kattis.problem.json");
                });
            else {
                console.log("Failed to download samples for " + arg2 + ", are you sure this problem exist?");
            }
        });
} else if (arg1 == "test") {

    if (!doProblemExist("kattis.problem.json")) {
        console.log("kattis.problem.json is missing");
        return;
    }

    var kattisconf = JSON.parse(fs.readFileSync("./kattis.problem.json").toString());

    if (!kattisjson.checkJson(kattisconf)) {
        console.log("kattis.problem.json is invalidt");
        return;
    }

    var results = [];
    var respassed = true;


    for (var i = 0; i < kattisconf.samples.in.length; i++) {
        try {
            checker.check(kattisconf.samples.in[i], kattisconf.samples.ans[i], kattisconf.solution, function(passed, input, ans, solution, resout) {
                results.push({
                    passed: passed,
                    input: input,
                    ans: ans,
                    solution: solution,
                    resout: resout
                });
                if (!passed)
                    respassed = false;
            });
        } catch (e) {
            console.log("Failed to load " + e.path);
            return;
        }
    };

    //wait for all to be done
    while (results.length < kattisconf.samples.in.length) {}

    if (arg2 != undefined && arg2.indexOf('v') > -1) {
        console.log("\nRunning with settings\n");

        console.log("Solution:");
        console.log("\t" + kattisconf.solution);

        console.log("Answers:");
        for (var i = 0; i < kattisconf.samples.ans.length; i++) {
            console.log("\t" + kattisconf.samples.ans[i]);
        };

        console.log("Inputs:");
        for (var i = 0; i < kattisconf.samples.in.length; i++) {
            console.log("\t" + kattisconf.samples.in[i]);
        };
    }

    for (var i = 0; i < results.length; i++) {
        console.log("\noutput from input " + (i + 1))
        console.log(results[i].resout.length > 0 ? chalk.yellow(results[i].resout) : chalk.red("output is empty"));
    };

    console.log("\nResultes")
    for (var i = 0; i < results.length; i++) {
        var color = results[i].passed ? chalk.green : chalk.red;
        var text = (results[i].passed ? "Succeeded" : "Failed") + " on input " + (i + 1);
        console.log(color(text));
    };
} else {
    printHelp();
}

/*
 * Helping methods
 */

function generateStartFiles(name, callback) {
    fs.writeFile('./' + name + '/solution.js', "", function(err) {
        callback(err);
    });
}

function doProblemExist(name) {
    try {
        fs.statSync("./" + name);
        return true;
    } catch (e) {
        return false;
    }
}

/*
 * Help
 */

function printHelp() {
    const config = require('./package.json');

    console.log(config.name + " verson " + config.version + "\n");

    console.log('Usage: kattis <command> [argument] [options]\n');

    console.log("Commands:");
    console.log("\tinit \t\t\tdownloads a specified problem");
    console.log("\ttest \t\t\truns your solution on the problem initialized in the folder\n");
    console.log("Options:");
    console.log("\-v \t\t\tverbose output. only works with 'test'");

    console.log("Example usage:");
    console.log("\tkattis init aaah \tdownloads and initializes the 'aaah' problem");
}