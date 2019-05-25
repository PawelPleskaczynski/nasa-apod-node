const dates = require('./date.js');
const request = require('request');

var exports = module.exports = {};
const base_url = 'https://apod.nasa.gov/apod/';

exports.getDay = function (body, date, html_tags, thumbs) {
	// data that can be returned
	let apod_site, copyright, description, hdurl, image_thumbnail, media_type, thumbnail_url, title, url;
	// create an empty object
	let data = {};
	// if date was not specified in the URL, get it from body and use it
	if (date === undefined) {
		date = dates.subtractDate(body('p').eq(1).text(), 0);
	}
	apod_site = `${base_url}ap${dates.getDate(date).substring(2)}.html`;

	// detect if APOD is an image, video or neither of them
	if (body('img').length !== 0) {
		let img = body('img').attr('src');
		url = base_url + img;

		let hd_img = body('img').parent().attr('href');
		hdurl = base_url + hd_img;

		media_type = 'image';
	} else if (body('iframe').length !== 0) {
		let src = body('iframe').eq(0).attr('src');
		if (src.includes('youtu') || src.includes('youtube') || src.includes('vimeo')) {
			if (thumbs === true) {
				thumbnail_url = getThumbs(src);
			}
			url = src;

			media_type = 'video';
		} else {
			media_type = 'other';
		}
	} else {
		media_type = 'other';
	}

	if (dates.getDate(date) < dates.getDate('1996-10-09') && dates.getDate(date) > dates.getDate('1995-09-21')) { // it's an APOD structured the old way

		copyright = body('center').eq(0).contents().text().replace(/\n/gm, ' ').replace( / {2,}/g, ' ').replace(/.+:/, '').trim();

		if (html_tags == true) {
			description = body('body').html();
			description = description.replace(/<\/b>/gm, '').replace(/<b>/gm, '').replace(/<\/p>/gm, '').replace(/<p>/gm, '').replace(/<\/center>/gm, '').replace(/<center>/gm, '');
			description = description.replace(/"ap/gm, '"https://apod.nasa.gov/apod/ap');
			description = description.replace(/\/\s/gm, '/');
			// replace relative URLs with absolute URL for NASA websites
			description = description.replace(/(href=")(?!http:\/\/|https:\/\/|ap)/gm, 'href="https://apod.nasa.gov/');
		} else {
			description = body('body').contents().text();
		}

		description = description.replace(/\n/gm, ' ').replace( / {2,}/g, ' ').replace(/^.+Explanation:/, '').replace(/Tomorrow('s|&apos;s) picture:.+/, '').trim();

		title = body('b').eq(0).text().trim().replace(/\n.+/gm, '');

	} else if (dates.getDate(date) <= dates.getDate('1995-09-21') && dates.getDate(date) >= dates.getDate('1995-06-16')) { // it's an APOD structured the oldest way

		if (html_tags == true) {
			description = body('body').html();
			description = description.replace(/<\/b>/gm, '').replace(/<b>/gm, '').replace(/<\/p>/gm, '').replace(/<p>/gm, '').replace(/<\/center>/gm, '').replace(/<center>/gm, '');
			description = description.replace(/"ap/gm, '"https://apod.nasa.gov/apod/ap');
			description = description.replace(/\/\s/gm, '/');
			// replace relative URLs with absolute URL for NASA websites
			description = description.replace(/(href=")(?!http:\/\/|https:\/\/|ap)/gm, 'href="https://apod.nasa.gov/');
		} else {
			description = body('body').contents().text();
		}

		if (date !== '1995-06-16') {
			copyright = body('body').text().replace(/\n/gm, ' ').replace( / {2,}/g, ' ').match(new RegExp(/Credit:(.*)Explanation/gm))[0].replace('Credit:', '').replace('Explanation', '').trim();
		}

		description = description.replace(/\n/gm, ' ').replace( / {2,}/g, ' ').replace(/^.+Explanation:/, '').replace(/Tomorrow('s|&apos;s) picture:.+/, '').trim();

		title = body('b').eq(0).text().trim().replace(/\n.+/gm, '');

	} else { // it's an APOD structured the new way

		copyright = body('center').eq(1).text().trim();
		copyright = copyright.split('\n');
		copyright = copyright.slice(2);
		copyright = copyright.join('\n');
		copyright = copyright.replace(/\n/gm, ' ').replace( / {2,}/g, ' ').trim().replace(/(?:^Image Credit & Copyright:|^Copyright:|^Credit:|^Credit and copyright:|^Image Credit:)/gmi, '');
		title = body('b').eq(0).text().trim();

		copyright = copyright.trim();

		if (html_tags == true) {
			description = body('p').eq(2).html().replace(/<b> Explanation: <\/b>/gm, '');
			description = description.replace(/"ap/gm, '"https://apod.nasa.gov/apod/ap');
			description = description.replace(/\/\s/gm, '/');
			// replace relative URLs with absolute URL for NASA websites
			description = description.replace(/(href=")(?!http:\/\/|https:\/\/|ap)/gm, 'href="https://apod.nasa.gov/');
		} else {
			description = body('p').eq(2).text().replace(/Explanation: /gm, '');
		}

		description = description.replace(/\n/gm, ' ').replace(/\s{2,}/g, ' ').trim();
	}

	if (title === '') {
		title = 'APOD for ' + date;
	}

	// add everything to the object
	data = {
		apod_site: apod_site,
		copyright: copyright,
		date: date,
		description: description,
		hdurl: hdurl,
		image_thumbnail: image_thumbnail,
		media_type: media_type,
		thumbnail_url: thumbnail_url,
		title: title,
		url: url
	};

	Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);

	// return all the data
	return data;
};

// get thumbnail if APOD is a video
function getThumbs(data) {
	let video_thumb;
	// get YouTube thumbnail
	if (data.includes('youtube') || data.includes('youtu.be')) {
		let youtube_id_regex = /(?:(?<=(v|V)\/)|(?<=be\/)|(?<=(\?|&)v=)|(?<=embed\/))([\w-]+)/gm;
		let video_id = data.match(youtube_id_regex);
		video_thumb = `https://img.youtube.com/vi/${video_id}/0.jpg`;
		return video_thumb;
		// get Vimeo thumbnail through Vimeo API
	} else if (data.includes('vimeo')) {
		let vimeo_id_regex = /(?!\/video\/)(\d+)/gm;
		let vimeo_id = data.match(vimeo_id_regex)[0];
		let url = `https://vimeo.com/api/v2/video/${vimeo_id}.json`;
		return new Promise(function(resolve, reject) {
			request(url, function(error, response, body) {
				if (error) return reject(error);
				video_thumb = JSON.parse(body);
				video_thumb = video_thumb[0].thumbnail_large.toString();
				try {
					resolve(video_thumb);
				} catch (e) {
					reject(e);
				}
			});
		});
	} else {
		return '';
	}
}
