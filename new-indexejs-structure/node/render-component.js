'use strict';

var path = require('path')
var config = require('../config')
var readFile = require('./read-file')
var serverConfig = config.server

function render (view, parent) {
	parent = parent || 'root'
	var _id = 0
	return view.replace(/\{%([\s\S]+?)%\}/gm, function (tag, attStr) {
		var cid = parent + '.' + _id++
		var tagName = attStr.match(/^\s*([\w\$\-]+)/m)
		if (!tagName) {
			return ''
		}
		tagName = tagName[1]
		// var atts = {}
		// attStr.replace(/[^\s=]+?="([^"]*?)"|[^\s=]+?='([^']*?)'|[^\s=]+?=(\w+?)/gm, 
		// 	function (a, name, value) {
		// 		atts[name] = value
		// 		return ''
		// })
		var tpl = readFile(path.join(serverConfig.components, tagName, tagName + '.tpl'), !config.isDev)
		var content = render(tpl, cid)
		// for the performance
		// if (atts.$replace == 'true') {
		if (/\$replace=true/.test(attStr)) {
			return content
		}
		return '<div ' + attStr.trim().replace(/^\s*[\w\$\-]+/m, '') + ' _cid="' + cid + '">' + content + '</div>'
	})
}

module.exports = render