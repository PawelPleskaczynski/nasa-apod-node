'use strict';

const request = require('request');
const cheerio = require('cheerio');
const dates = require('./utils/date.js');
const loader = require('./utils/loader.js');
const search = require('./search.js');
const iconv = require('iconv-lite');

const encoding = 'windows-1252';

class APOD {
	constructor() { }
	get(options, callback) {
		var date, html_tags, thumbs, enddate, startdate, count;
		if (options != undefined) {
			if ('date' in options)
				date = options.date;
			if ('html_tags' in options)
				html_tags = options.html_tags;
			if ('thumbs' in options)
				thumbs = options.thumbs;
			if ('end_date' in options)
				enddate = options.end_date;
			if ('start_date' in options)
				startdate = options.start_date;
			if ('count' in options)
				count = options.count;
		}

		let result;
		
		function getAPODs() {
			let array = [];
			for (let i = 0; i <= dates.daysDifference(startdate, enddate); i++) {
				(function(i) {
					array.push(new Promise((resolve, reject) =>
						request.get({url: 'https://apod.nasa.gov/apod/ap' + dates.getDate(dates.subtractDate(enddate, i)).substring(2) + '.html', encoding: null}, function(error, response, body) {
							if (error) reject(error);
							if (response.statusCode === 200) {
								body = iconv.decode(body, encoding);
								const $ = cheerio.load(body);
								let data = loader.getDay($, dates.subtractDate(enddate, i), html_tags, thumbs);
								resolve(data);
							} else {
								let data = {};
								resolve(data);
							}
						})
					));
				})(i);
			}
			return Promise.all(array);
		}
		
		function show($, date) {
			let data = loader.getDay($, date, html_tags, thumbs);
			return data;
		}
		
		function getCount(count) {
			let array = [];
			for (let i = 0; i < count; i++) {
				(function get() {
					let date = dates.getRandom();
					array.push(new Promise((resolve, reject) =>
						request.get({url: 'https://apod.nasa.gov/apod/ap' + date.joined+ '.html', encoding: null}, function(error, response, body) {
							if (error) reject(error);
							if (response.statusCode === 200) {
								body = iconv.decode(body, encoding);
								const $ = cheerio.load(body);
								let data = loader.getDay($, date.request, html_tags, thumbs);
								resolve(data);
							} else {
								get();
							}
						})
					));
				})();
			}
			return Promise.all(array);
		}
		
		if (date === undefined) {
			if (startdate !== undefined && enddate !== undefined) {
				if (dates.getDate(startdate) > dates.getDate(enddate)) {
					throwError('start_date cannot be later than end_date', callback);
				} else if (dates.getDate(startdate) < dates.getDate('1995-06-16')) {
					throwError('start_date cannot be later than end_date', callback);
				} else {
					getAPODs().then(data => {
						return callback(null, data.filter(value => Object.keys(value).length !== 0));
					});
				}
			} else if (count !== undefined) {
				if (count > 0) {
					getCount(count).then(data => {
						return callback(null, data);
					});
				} else {
					throwError('count must be larger than 0', callback);
				}
			} else {
				let url = 'https://apod.nasa.gov/apod/astropix.html';
				request.get({url: url, encoding: null}, function(error, response, body) {
					if (response) {
						body = iconv.decode(body, encoding);
						const $ = cheerio.load(body);
						return callback(null, show($, date));
					} else {
						throwError('An error happened while requesting the APOD.', callback);
					}
				});
			}
		} else {
			if (dates.getDate(date) >= dates.getDate('1995-06-16')) {
				let url = 'https://apod.nasa.gov/apod/ap' + dates.getDate(date).substring(2) + '.html';
				request.get({url: url, encoding: null}, function(error, response, body) {
					if (error) {
						throwError('An error happened while requesting the APOD.', callback);
					} else if (response) {
						body = iconv.decode(body, encoding);
						const $ = cheerio.load(body);
						return callback(null, show($, date));
					}
				});
			} else {
				throwError('`date` cannot be before the first APOD (June 16, 1995)', callback);
			}
		}

		return result;
	}

	search(options, callback) {
		var html_tags, thumbs, query, number, page;
		if (options != undefined) {
			if ('html_tags' in options)
				html_tags = options.html_tags;
			if ('thumbs' in options)
				thumbs = options.thumbs;
			if ('query' in options)
				query = options.query;
			if ('number' in options)
				number = options.number;
			if ('page' in options)
				page = options.page;
		}

		function show($) {
			search.find($, html_tags, thumbs, number, page).then((data, err) => {
				if (err || data.length == 0) {
					throwError(`No results for query '${query}'`, callback);
				} else {
					return callback(null, data);
				}
			});
		}
	
		if (query !== undefined) {
			let url = 'https://apod.nasa.gov/cgi-bin/apod/apod_search?tquery=' + query;
			request.get({url: url, encoding: null}, function(error, response, body) {
				if (error) {
					throwError('An error happened while requesting APOD website.', callback);
				} else if (response) {
					body = iconv.decode(body, encoding);
					const $ = cheerio.load(body);
					show($);
				}
			});
		} else {
			throwError('Please specify query.', callback);
		}
	}
}

function throwError(message, callback) {
	return callback({error: message}, null);
}

module.exports = APOD;