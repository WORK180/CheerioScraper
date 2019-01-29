var request = require('request');
var cheerio = require('cheerio');
var argv = require('minimist')(process.argv.slice(2));

var blogLinks = [];
var page = argv._[0];

request(`https://www.work180.com.au/blog?page=${page}`, function (error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        links = $('#blogs > a'); //jquery get all hyperlinks
        $(links).each(function (i, link) {
            blogLinks.push("https://www.work180.com.au" + $(link).attr('href'));
        });

        var JsonData = JSON.stringify(blogLinks);
        var fs = require('fs');
        fs.appendFile(`blogs/index/blogIndex.json`, JsonData, function (err) {
            if (err) {
                console.log(err);
            }
            console.log(blogLinks.length);
            console.log(`Saving blogs File.`);

        });
    }
});
