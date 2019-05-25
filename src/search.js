/* eslint-disable no-inner-declarations */
const dates = require('./utils/date.js');
const loader = require('./utils/loader.js');
const request = require('request');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');
let encoding = 'windows-1252';
var exports = module.exports = {};

exports.find = async function (body, html_tags, thumbs, number, page) {
	let return_data = new Promise(async function(resolve) {
		let days;
		let i = 1;

		if (number !== undefined) {
			if (number > 200) {
				number = 200;
			}
			if (page !== undefined) {
				i = (page - 1) * number + 1;
			} else {
				page = 1;
			}
			days = number * page;
		} else {
			days = (body('img').length);
		}
		let data;

		if (days > 0) {
			let array = [];
			for (i; (number !== undefined && page !== undefined) ? (i <= days) : (i < days); i++) {
				(async function(i) {
					array.push(new Promise(function(resolve) {
						if (body('img').eq(i).parent().attr('href') === null || body('img').eq(i).parent().attr('href') === undefined) {
							let date = {};
							resolve(date);
						} else {
							let date = dates.getDateFromURL(body('img').eq(i).parent().attr('href').match(/[0-9]{6}/gm)[0]);
							resolve(date);
						}
					}));
				})(i);
				data = await Promise.all(array);
			}

			getAPODs(data);

			async function getAPODs(date_array) {
				let array = [];
				for (let i = 1; (number !== undefined && page !== undefined) ? (i <= days) : (i < days); i++) {
					(async function(i) {
						array.push(new Promise((resolve, reject) =>
							request.get({url: 'https://apod.nasa.gov/apod/ap' + dates.getDate(date_array[i - 1]).substring(2) + '.html', encoding: null}, async function(error, response, body) {
								if (error) {
									reject(error);
								} else {
									// if APOD exists, parse it, otherwise make the object empty
									if (response.statusCode === 200) {
										body = iconv.decode(body, encoding);
										const $ = cheerio.load(body);
										let data = await loader.getDay($, date_array[i - 1], html_tags, thumbs);
										resolve(data);
									} else {
										data = {};
										resolve(data);
									}
								}
							})
						));
					})(i);
				}
				let output = await Promise.all(array);
				// filter out empty objects
				output = output.filter(value => Object.keys(value).length !== 0);
				resolve(output);
			}
		}
	});

	return Promise.resolve(return_data);
};
