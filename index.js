const request = require('request-promise');
const cheerio = require('cheerio');
var validUrl = require('valid-url');
var fs = require('fs');

var links = [];
var copylinks = [];

mainlink();


async function mainlink() {
	try {
		//this function starts with loading the main url medium.com and initializes five concurrent processes
		const mainurl = 'https://medium.com/';
		const main = await request(mainurl);
		const $ = cheerio.load(main);

		links = $('a').map((i, element) => {
			return $(element).attr('href');
		}).get();

		copylinks = JSON.parse(JSON.stringify(links));
			//file creation and writing all homepage links to a file
			fs.writeFile("all_internal_links.txt", copylinks, function(err) {
			    if(err) {
			        return console.log(err);
			    }
			    console.log("The file was saved!");
			}); 
		//five concurrent process initialization
		var totalLoop = 5;
		for( var i = 0; i < totalLoop; i++ ) {
			var url = links.shift();
			while(!validUrl.isUri(url) || !url.includes('medium.com')) {
			url = links.shift();
			}
			//checking whether the links are valid or not and checks whether it is an internal url or not
			if(validUrl.isUri(url) && !links.includes(url) && url.includes('medium.com')) {
			  	console.log(url);
			  	//getNextUrl function takes every single url and finds all the internal urls within itself
		  	  	getNextUrl(url); 
		  	}
		}
	} catch (e) {
		console.log(e);
	}
}

async function getNextUrl(url) {
	try {
		const insidelink = await request(url);
		const $ = cheerio.load(insidelink);

		const insidelinks = $('a').map((i, inside) => {
			return $(inside).attr('href');
		}).get(); 

		for(var i=0;i<insidelinks.length;i++) {
			if (!links.includes(insidelinks[i])) {
				links.push(insidelinks[i]);
				copylinks.push(insidelinks[i]);
			}
		}
		var newlink = links.shift();
		console.log('new');
		console.log(newlink);
		while(!validUrl.isUri(newlink) || !newlink.includes('medium.com')) {
			newlink = links.shift();
		}
		if(validUrl.isUri(newlink) && newlink.includes('medium.com')) {
			//new URls are appended to the file
			fs.appendFile('all_internal_links.txt', ', ' + newlink, 'utf8',
			    // callback function
			    function(err) { 
			        if (err) throw err;
			        // if no error
			        console.log("Data is appended to file successfully.")
			        console.log(newlink);
			setTimeout(function(){getNextUrl(newlink)}, 100) ;
			});
			
		} 
	} catch(e) {
		console.log(e);
	}
}