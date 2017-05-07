'use strict';

var env = process.env.NODE_ENV || 'development'
var path = require('path')

var VIDEO_PAGE_COUNT = 16
var NEWS_PAGE_COUNT = 10

module.exports = {
	env: env,
	isDev: env !== 'production' && env !== 'test',
	server: {
		layout: path.join(__dirname, 'release/layout.html'),
		views: path.join(__dirname, 'c/pages'),
		components: path.join(__dirname, 'c/comps'),
		apis: {
			/**
			 * 10.169.134.88 star.tag.qq.com
			 * http://star.tag.qq.com/api/page?site=ent&tag=%E7%8E%8B%E8%8F%B2&num=1&timestamp=0&flag=0&type=hd
			 * 
			 * site:频道-ent
			 * tag：标签名称
			 * num:一页请求数
			 * timestamp：翻页时间戳
			 * flag-最新；1-比timestamp旧 2-比timestamp新
			 * type：文章类型 normal-普通 hd-高清
			 **/
			news: 'http://star.tag.webdev.com/api/page?site=ent',
			film_info: 'http://ticketapi.video.qq.com/film_info?otype=json'
		}
	},
	client: {
		apis: {
			news: 'http://star.tag.qq.com/api/page?site=ent'
			// news: 'http://star.tag.webdev.com/api/page?site=ent'
		},
		page_count: VIDEO_PAGE_COUNT,
		news_page_count: NEWS_PAGE_COUNT
	},
	/**
	 * 视频分页数
	 */
	page_count: VIDEO_PAGE_COUNT,
	/**
	 * 资讯分页数
	 */
	news_page_count: NEWS_PAGE_COUNT
}