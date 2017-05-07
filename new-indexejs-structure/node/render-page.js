'use strict';

var fs = require('fs')
var path = require('path')
var config = require('../config')
var readFile = require('./read-file')
var renderComponent = require('./render-component')
var template = require('ejs')
var serverConfig = config.server

var _compiledPages = {}
function renderPage(page, data, options) {
	options = options || {}
	var layout = template.compile(readFile(serverConfig.layout, !config.isDev))
	var cached = !config.isDev
	var clientRender = !options.serverSideRender
	/**
	 * 编译阶段
	 */
	var view
	if (cached && _compiledPages[page]) {
		view = _compiledPages[page]
	} else {
		view = readFile(path.join(serverConfig.views, ':page/:page.tpl'.replace(/:page/g, page)), cached)
		view = renderComponent(view, page)
		view = {
			server: template.compile(view),
			client: JSON.stringify(
				view.replace('<script>', '{%script%}').replace('</script>', '{%/script%}')
			)
		}
		if (cached) _compiledPages[page] = view
	}
	
	if (options.pagelet) {
		/**
		 * page 不使用客户端渲染
		 */
		return view.server(data)
	}

	/**
	 * 渲染阶段
	 */
	return layout(data).replace(/\{%\s*view\s*%\}/, function () {
		/**
		 * 服务端渲染
		 */
		if (options.serverSideRender) {
			return view.server(data)
		}
		/**
		 * 客户端渲染
		 */
		function clientRenderScript() {
			return '<script>(' + _clientRender.toString() + ')(' 
				+ /*tpl*/view.client + ', "' 
				+ /*pid*/page + '", '
				+ /*data*/JSON.stringify(data) + 
			')</script>'
		}
		return '<div id="_pid_' + page + '">' + clientRenderScript() + '</div>'
	})
}

function _clientRender (tpl, pid, data) {
	var view = template.compile(tpl)(data)
	var tar = document.getElementById('_pid_' + pid)

	tar.innerHTML = view.replace('{%script%}', '<script' + '>')
						.replace('{%/script%}', '</script' + '>')
}

module.exports = renderPage