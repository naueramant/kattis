var fs = require('fs-extra');
var path = require('path');

exports.generateJson = function(name, callback) {
    //list files in samples
    var items = [] // files, directories, symlinks, etc 
    fs.walk('./' + name + '/samples')
        .on('data', function(item) {
            items.push(item.path)
        })
        .on('end', function() {
            var ans = [];
            var ins = [];

            for (i of items) {
                if (i.endsWith('ans'))
                    ans.push(path.normalize(i));
                if (i.endsWith('in'))
                    ins.push(path.normalize(i));

            }

            var json = {
                problem: name,
                solution: path.format({
                    dir: process.cwd() + "\\" + name,
                    base: "solution.js"
                }),
                samples: {
                    ans: ans,
                    in : ins
                }
            };

            //write file
            fs.writeFile('./' + name + '/kattis.problem.json', JSON.stringify(json, null, 4), function(err) {
                callback(err);
            });
        });
}

exports.checkJson = function(json) {
    if (json.solution == undefined || json.solution.length <= 0)
        return false;
    if (json.samples.ans == undefined || json.samples.ans.length <= 0)
        return false;
    if (json.samples.in == undefined || json.samples.in.length <= 0)
        return false;
    if (json.samples.in.length != json.samples.ans.length)
        return false;
    return true;
}