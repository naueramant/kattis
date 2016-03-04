var Download = require('download');

exports.download = function(name, callback){
 	new Download({mode: '755', extract: true})
    .get('https://open.kattis.com/problems/' + name + '/file/statement/samples.zip')
    .dest('./' + name + '/samples')
    .run(callback);
 }