# nasa-apod-node
### What's this package for?
This pagkage is for fetching data from [NASA's APOD](https://apod.nasa.gov) website - a popular service showing the most beautiful astronomical photographs in the world. The data is returned in JSON format and can be used for various things, such as creating beautiful APOD frontends.
### Installation and usage
##### Installation
Install using `npm` or your favorite Node.js package manager:
```
yarn add nasa-apod-node
```

##### Available options for `get` function:
- `date`: a string in YYYY-MM-DD format, when set to a date (minimum date: 1995-06-16), returns an APOD from this date as a JSON object.
- `start_date` and `end_date` (you need to specify both parameters if you want to use them): strings in YYYY-MM-DD format indicating start and end of date range. All the APODs in the range will be returned as a JSON array.
- `thumbs`: a boolean, when set to `true`, a video thumbnail will be returned if the APOD is a video.
- `html_tags`: a boolean, when set to `true`, the description will be in the original HTML format.
- `count`: an integer, when larger than 0, the API will return specified number of random APODs

##### Available options for `search` function:
- Note: options `thumbs` and `html_tags` can be used here.
- `search_query`: a string, the API will search for APODs with this string.
- `number`: optional, but recommended integer, the API will return only n number of APODs that match the `search_query`.
- `page`: an integer, the API will return nth page of APODs if `number` is specified.

##### Returned fields:
- `apod_site`: a link to the original APOD website for the given day.
- `copyright`: the copyright of the APOD.
- `date`: requested date.
- `description`: description of the APOD. It can have original HTML formatting, if `html_tags` is set to `true` (useful if you want to get links from the original description).
- `thumbnail_url`: if an APOD is a video, this field will have a link to video thumbnail (works for videos hosted on YouTube and Vimeo).
- `url`: url of the image or video.
- `hdurl`: returned if the APOD is an image. It will return the higher resolution version of the image.
- `media_type`: depending on the APOD, it can be `image`, `video` or `other`.
- `title`: title of the APOD.

#### Examples
Import and initialize this package:
```
const APOD = require('nasa-apod-node');
const apod = new APOD();
```
##### Simple request
```
apod.get({}, (err, data) => {
    if (err)
        console.log(err);
    else
        console.log(data);
});
```

This will return the latest available APOD, with no additional options:
```
{ apod_site: 'https://apod.nasa.gov/apod/ap190525.html',
  copyright: 'Daniel Lopez (El Cielo de Canarias)',
  date: '2019-05-25',
  description:
   "What bizarre planet are these alien creatures from? It's only planet Earth, of course. The planet's home galaxy the Milky Way stretches across a dark sky in the panoramic, fisheye all-sky projection composed with a wide lens. But the imposing forms gazing skyward probably look strange to many denizens of Earth. Found on the Canary Island of Tenerife in the Teide National Park, they are red tajinastes, flowering plants that grow to a height of up to 3 meters. Among the rocks of the volcanic terrain, tajinastes bloom in spring and early summer and then die after a week or so as their seeds mature. A species known as Echium wildpretii, the terrestrial life forms were individually lit by flashlight during the wide-angle exposures.",
  hdurl:
   'https://apod.nasa.gov/apod/image/1905/Echium_Wildpretii_World_DLopez.jpg',
  media_type: 'image',
  title: 'Planet of the Tajinastes',
  url:
   'https://apod.nasa.gov/apod/image/1905/Echium_Wildpretii_World_DLopez.jpg' }
```
##### Date request with HTML tags
```
apod.get({date: '2000-01-01', html_tags: true}, (err, data) => {
    console.log(data);
});
```

This will return APOD from 2000-01-01 with HTML tags in the description:
```
{ apod_site: 'https://apod.nasa.gov/apod/ap000101.html',
  copyright:
   'Camille Flammarion; Courtesy: HSC, U. Oklahoma; Digitization: K. Magruder (OU); Coloring: R. J. Nemiroff (Michigan Tech)',
  date: '2000-01-01',
  description:
   'Welcome to the <a href="http://www.usno.navy.mil/millennium/">millennial year</a> at the threshold of <a href="http://www.thirdmil.org/">millennium three</a>. During <a href="https://apod.nasa.gov/apod/ap991231.html">millennium two</a>, humanity continually redefined its concept of &quot;Universe&quot;: first as spheres centered on the <a href="http://csep10.phys.utk.edu/astr161/lect/retrograde/aristotle.html">Earth</a>, in mid-millennium as the <a href="http://es.rice.edu/ES/humsoc/Galileo/Things/copernican_system.html">Solar System</a>, a few centuries ago as the <a href="http://www.phy.syr.edu/courses/AST104.99Spring/Milky.htm">Galaxy</a>, and within the last century as the <a href="http://antwrp.gsfc.nasa.gov/htmltest/gifcity/matter.html">matter</a> emanating from the <a href="http://www.astro.ucla.edu/~wright/cosmo_01.htm">Big Bang</a>. During <a href="http://aa.usno.navy.mil/AA/faq/docs/millennium.html">millennium three</a> humanity may hope to discover <a href="http://www.reston.com/astro/extreme.html">alien life</a>, to understand the <a href="http://antwrp.gsfc.nasa.gov/debate/debate98.html">geometry and composition of our present concept of Universe</a>, and even to <a href="http://www.friends-partners.org/~mwade/articles/probirth.htm">travel through this Universe</a>. Whatever our <a href="http://www.bios.niu.edu/orion/history.html">accomplishments</a>, humanity will surely find <a href="http://www.seti-inst.edu/game/">adventure</a> and <a href="http://sciam.com/1999/1299issue/1299maddox.html">discovery</a> in the <a href="http://www.wordwizz.com/pwrsof10.htm">space above and beyond</a>, and possibly define the <a href="https://apod.nasa.gov/apod/ap990627.html">surrounding Universe</a> in ways and colors we cannot yet imagine by the threshold of <a href="http://www.wsfs.org/hugos.html">millennium four</a>.',
  hdurl:
   'https://apod.nasa.gov/apod/image/0001/flammarion_halfcolor.gif',
  media_type: 'image',
  title: 'The Millennium that Defines Universe',
  url:
   'https://apod.nasa.gov/apod/image/0001/flammarion_halfcolor_big.gif' }
```
##### List request
```
apod.get({start_date: '2018-10-07', end_date: '2018-10-10', thumbs: true}, (err, data) => {
    console.log(data);
});
```

This will return APODs between 2018-10-07 and 10, with video thumbnails:
```
[ { apod_site: 'https://apod.nasa.gov/apod/ap181010.html',
    copyright: 'NASA, SDO; Processing: Alan Watson via Helioviewer',
    date: '2018-10-10',
    description:
     "Sometimes, the surface of our Sun seems to dance. In the middle of 2012, for example, NASA's Sun-orbiting Solar Dynamic Observatory spacecraft imaged an impressive prominence that seemed to perform a running dive roll like an acrobatic dancer. The dramatic explosion was captured in ultraviolet light in the featured time-lapse video covering about three hours. A looping magnetic field directed the flow of hot plasma on the Sun. The scale of the dancing prominence is huge -- the entire Earth would easily fit under the flowing arch of hot gas. A quiescent prominence typically lasts about a month, and may erupt in a Coronal Mass Ejection (CME) expelling hot gas into the Solar System. The energy mechanism that creates a solar prominence is still a topic of research. Unlike 2012, this year the Sun's surface is significantly more serene, featuring fewer spinning prominences, as it is near the minimum in its 11-year magnetic cycle.",
    media_type: 'video',
    thumbnail_url: 'https://img.youtube.com/vi/hQFEHH5E69s/0.jpg',
    title: 'Sun Dance',
    url: 'https://www.youtube.com/embed/hQFEHH5E69s?rel=0' },
  { apod_site: 'https://apod.nasa.gov/apod/ap181009.html',
    copyright:
     'Hubble Legacy Archive, NASA, ESA; Processing & Copyright: Domingo Pestana & Raul Villaverde',
    date: '2018-10-09',
    description:
     "Many spiral galaxies have bars across their centers. Even our own Milky Way Galaxy is thought to have a modest central bar. Prominently barred spiral galaxy NGC 1672, featured here, was captured in spectacular detail in an image taken by the orbiting Hubble Space Telescope. Visible are dark filamentary dust lanes, young clusters of bright blue stars, red emission nebulas of glowing hydrogen gas, a long bright bar of stars across the center, and a bright active nucleus that likely houses a supermassive black hole. Light takes about 60 million years to reach us from NGC 1672, which spans about 75,000 light years across. NGC 1672, which appears toward the constellation of the Dolphinfish (Dorado), is being studied to find out how a spiral bar contributes to star formation in a galaxy's central regions.",
    hdurl:
     'https://apod.nasa.gov/apod/image/1810/NGC1672_Hubble_3600.jpg',
    media_type: 'image',
    title: 'NGC 1672: Barred Spiral Galaxy from Hubble',
    url:
     'https://apod.nasa.gov/apod/image/1810/NGC1672_Hubble_1080.jpg' },
  { apod_site: 'https://apod.nasa.gov/apod/ap181008.html',
    copyright: 'Fritz Helmut Hemmerich',
    date: '2018-10-08',
    description:
     "Small bits of this greenish-gray comet are expected to streak across Earth's atmosphere tonight. Specifically, debris from the eroding nucleus of Comet 21P / Giacobini-Zinner, pictured, causes the annual Draconids meteor shower, which peaks this evening. Draconid meteors are easy to enjoy this year because meteor rates will likely peak soon after sunset with the Moon's glare nearly absent. Patience may be needed, though, as last month's passing of 21P near the Earth's orbit is not expected to increase the Draconids' normal meteor rate this year of (only) a few meteors per hour. Then again, meteor rates are notoriously hard to predict, and the Draconids were quite impressive in 1933, 1946, and 2011. Featured, Comet 21P gracefully posed between the Rosette (upper left) and Cone (lower right) nebulas two weeks ago before heading back out to near the orbit of Jupiter, to return again in about six and a half years.",
    hdurl:
     'https://apod.nasa.gov/apod/image/1810/Comet21P_Hemmerich_1440.jpg',
    media_type: 'image',
    title: 'Comet 21P Between Rosette and Cone Nebulas',
    url:
     'https://apod.nasa.gov/apod/image/1810/Comet21P_Hemmerich_960.jpg' },
  { apod_site: 'https://apod.nasa.gov/apod/ap181007.html',
    copyright: 'Cary & Michael Huang',
    date: '2018-10-07',
    description:
     'What does the universe look like on small scales? On large scales? Humanity is discovering that the universe is a very different place on every proportion that has been explored. For example, so far as we know, every tiny proton is exactly the same, but every huge galaxy is different. On more familiar scales, a small glass table top to a human is a vast plane of strange smoothness to a dust mite -- possibly speckled with cell boulders. Not all scale lengths are well explored -- what happens to the smallest mist droplets you sneeze, for example, is a topic of active research -- and possibly useful to know to help stop the spread of disease. The featured interactive flash animation, a modern version of the classic video Powers of Ten, is a new window to many of the known scales of our universe. By moving the scroll bar across the bottom, you can explore a diversity of sizes, while clicking on different items will bring up descriptive information.',
    media_type: 'other',
    title: 'The Scale of the Universe - Interactive' } ]
```
##### Random request
```
apod.get({count: 2}, (err, data) => {
    console.log(data);
});
```

This will return two random APODs, with no additional options:
```
[ { apod_site: 'https://apod.nasa.gov/apod/ap161127.html',
    copyright: 'Voyager 2, NASA',
    date: '2016-11-27',
    description:
     "Could you survive a jump off the tallest cliff in the Solar System? Quite possibly. Verona Rupes on Uranus' moon Miranda is estimated to be 20 kilometers deep -- ten times the depth of the Earth's Grand Canyon. Given Miranda's low gravity, it would take about 12 minutes for a thrill-seeking adventurer to fall from the top, reaching the bottom at the speed of a racecar -- about 200 kilometers per hour. Even so, the fall might be survivable given proper airbag protection. The featured image of Verona Rupes was captured by the passing Voyager 2 robotic spacecraft in 1986. How the giant cliff was created remains unknown, but is possibly related to a large impact or tectonic surface motion.",
    hdurl:
     'https://apod.nasa.gov/apod/image/1611/mirandascarp_vg2_1016.jpg',
    media_type: 'image',
    title: 'Verona Rupes: Tallest Known Cliff in the Solar System',
    url:
     'https://apod.nasa.gov/apod/image/1611/mirandascarp_vg2_960.jpg' },
  { apod_site: 'https://apod.nasa.gov/apod/ap111017.html',
    copyright: 'NASA, ESA, M. Postman (STScI), and the CLASH Team',
    date: '2011-10-17',
    description:
     "It is difficult to hide a galaxy behind a cluster of galaxies. The closer cluster's gravity will act like a huge lens, pulling images of the distant galaxy around the sides and greatly distorting them. This is just the case observed in the above recently released image from the CLASH survey with the Hubble Space Telescope. The cluster MACS J1206.2-0847 is composed of many galaxies and is lensing the image of a yellow-red background galaxy into the huge arc on the right. Careful inspection of the image will reveal at least several other lensed background galaxies -- many appearing as elongated wisps. The foreground cluster can only create such smooth arcs if most of its mass is smoothly distributed dark matter -- and therefore not concentrated in the cluster galaxies visible. Analyzing the positions of these gravitational arcs also gives astronomers a method to estimate the dark matter distribution in galaxy clusters, and infer from that when these huge conglomerations of galaxies began to form.",
    hdurl: 'https://apod.nasa.gov/apod/image/1110/macs1206_hst_973.jpg',
    media_type: 'image',
    title: 'MACS 1206: A Galaxy Cluster Gravitational Lens',
    url: 'https://apod.nasa.gov/apod/image/1110/macs1206_hst_900.jpg' } ]
```
##### Search request
```
apod.search({query: 'M27'}, (err, data) => {
    console.log(data);
});
```

This will return every APOD that matches the query `M27`:
```
[ { apod_site: 'https://apod.nasa.gov/apod/ap170609.html',
    copyright:
     'Data; Subaru, NAOJ, Assembly and Processing; Roberto Colombari',
    date: '2017-06-09',
    description:
     "While hunting for comets in the skies above 18th century France, astronomer Charles Messier diligently kept a list of the things he encountered that were definitely not comets. This is number 27 on his now famous not-a-comet list. In fact, 21st century astronomers would identify it as a planetary nebula, but it's not a planet either, even though it may appear round and planet-like in a small telescope. Messier 27 (M27) is an excellent example of a gaseous emission nebula created as a sun-like star runs out of nuclear fuel in its core. The nebula forms as the star's outer layers are expelled into space, with a visible glow generated by atoms excited by the dying star's intense but invisible ultraviolet light. Known by the popular name of the Dumbbell Nebula, the beautifully symmetric interstellar gas cloud is over 2.5 light-years across and about 1,200 light-years away in the constellation Vulpecula. This spectacular color image incorporates broad and narrowband observations recorded by the 8.2 meter Subaru telescope.",
    hdurl:
     'https://apod.nasa.gov/apod/image/1706/M27Subaru_colombari1824_q100_watermark.jpg',
    media_type: 'image',
    title: 'M27: Not a Comet',
    url:
     'https://apod.nasa.gov/apod/image/1706/M27Subaru_colombari1024_q100_watermark.jpg'
    },
    ... (lots of results) ...
]
```
##### Paged search request
```
apod.search({query: 'M27', number: 3, page: 2}, (err, data) => {
    console.log(data);
});
```

This will return second page of 3 APODs that match the `M27` query:
```
[ { apod_site: 'https://apod.nasa.gov/apod/ap150227.html',
    copyright: 'Rolando Ligustri (CARA Project, CAST)',
    date: '2015-02-27',
    description:
     "Buffeted by the solar wind, Comet Lovejoy's crooked ion tail stretches over 3 degrees across this telescopic field of view, recorded on February 20. The starry background includes awesome bluish star Phi Persei below, and pretty planetary nebula M76 just above Lovejoy's long tail. Also known as the Little Dumbbell Nebula, after its brighter cousin M27 the Dumbbell Nebula, M76 is only a Full Moon's width away from the comet's greenish coma. Still shining in northern hemisphere skies, this Comet Lovejoy (C/2014 Q2) is outbound from the inner solar system some 10 light-minutes or 190 million kilometers from Earth. But the Little Dumbbell actually lies over 3 thousand light-years away. Now sweeping steadily north toward the constellation Cassiopeia Comet Lovejoy is fading more slowly than predicted and is still a good target for small telescopes.",
    hdurl:
     'https://apod.nasa.gov/apod/image/1502/Feb20Lovejoy_astroligu60.jpg',
    media_type: 'image',
    title: 'Long Lovejoy and Little Dumbbell',
    url:
     'https://apod.nasa.gov/apod/image/1502/Feb20Lovejoy_astroligu60c1024.jpg' },
  { apod_site: 'https://apod.nasa.gov/apod/ap140914.html',
    copyright: 'Bill Snyder (Bill Snyder Photography)',
    date: '2014-09-14',
    description:
     "The first hint of what will become of our Sun was discovered inadvertently in 1764. At that time, Charles Messier was compiling a list of diffuse objects not to be confused with comets. The 27th object on Messier's list, now known as M27 or the Dumbbell Nebula, is a planetary nebula, the type of nebula our Sun will produce when nuclear fusion stops in its core. M27 is one of the brightest planetary nebulae on the sky, and can be seen toward the constellation of the Fox (Vulpecula) with binoculars. It takes light about 1000 years to reach us from M27, shown above in colors emitted by hydrogen and oxygen. Understanding the physics and significance of M27 was well beyond 18th century science. Even today, many things remain mysterious about bipolar planetary nebula like M27, including the physical mechanism that expels a low-mass star's gaseous outer-envelope, leaving an X-ray hot white dwarf.",
    hdurl: 'https://apod.nasa.gov/apod/image/1409/m27_snyder_2150.jpg',
    media_type: 'image',
    title: 'M27: The Dumbbell Nebula',
    url: 'https://apod.nasa.gov/apod/image/1409/m27_snyder_960.jpg' },
  { apod_site: 'https://apod.nasa.gov/apod/ap111227.html',
    copyright: 'Bill Snyder (Bill Snyder Photography)',
    date: '2011-12-27',
    description:
     "The first hint of what will become of our Sun was discovered inadvertently in 1764. At that time, Charles Messier was compiling a list of diffuse objects not to be confused with comets. The 27th object on Messier's list, now known as M27 or the Dumbbell Nebula, is a planetary nebula, the type of nebula our Sun will produce when nuclear fusion stops in its core. M27 is one of the brightest planetary nebulae on the sky, and can be seen toward the constellation of the Fox (Vulpecula) with binoculars. It takes light about 1000 years to reach us from M27, shown above in colors emitted by hydrogen and oxygen. Understanding the physics and significance of M27 was well beyond 18th century science. Even today, many things remain mysterious about bipolar planetary nebula like M27, including the physical mechanism that expels a low-mass star's gaseous outer-envelope, leaving an X-ray hot white dwarf.",
    hdurl: 'https://apod.nasa.gov/apod/image/1112/m27_snyder_2150.jpg',
    media_type: 'image',
    title: 'M27: The Dumbbell Nebula',
    url: 'https://apod.nasa.gov/apod/image/1112/m27_snyder_900.jpg' } ]
```
##### Very simple server
```
const express = require('express');
const app = express();
const port = (3000);

const APOD = require('nasa-apod-node');
const apod = new APOD();

app.get('/', (req, res) => {
    apod.get({}, (err, data) => {
        if (err)
            console.log(err);
        else
            res.send(`<style>p, h1 { color: #fff; } body {background-color: #111;}</style><body style="width: 600px; margin: auto;"><h1>${data.title}</h1><br><a href="${data.hdurl}"><img style="width: 200px; height: auto;" src="${data.url}"></a><br><p>${data.description}</p></body>`);
    });
});

app.listen(port)
```
This will serve a simple page with the latest APOD on `0.0.0.0:3000`