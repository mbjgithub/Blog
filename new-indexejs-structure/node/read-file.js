'use strict';

var fs = require('fs')

var _files = {}
var _offlineFiles = {}

function readFile(path, cache) {
	if (_offlineFiles[path]) return _offlineFiles[path] 
	if (cache && _files[path]) return _files[path]
	var file
	try {
		file = fs.readFileSync(path, 'utf-8')
		if (cache) {
			_files[path] = file
		}
	} catch(e) {
		console.error(e)
		file = ''
	}
	return file
}

readFile.offline = function (path, value) {
	_offlineFiles[path] = value
}
module.exports = readFile