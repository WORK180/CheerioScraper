var request = require('request');
var cheerio = require('cheerio');
var argv = require('minimist')(process.argv.slice(2));

var blogUrl = argv._[0];

var blogDetails = {
    "url": blogUrl,
    "title": "",
    "author": "",
    "body": "",
    "tags": [],
    "upload_date": "",
    "associated_company": ""
};


request(`${blogUrl}`, function (error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        blogDetails.title = ($('h1').text());
        blogDetails.author = ($('.author-name > p').text());
        blogDetails.body = ($('.blog-body').html());

        //get date from url
        blogDetails.upload_date = blogUrl.substring(32, 39);

        //get tags and add to array
        $('small').each(function (i, element) {
            blogDetails.tags.push($(this).text().replace(",", "").trim());
        });
        if (blogDetails.author = "WORK180") {
            blogDetails.associated_company = "work180";
        } else {
            blogDetails.associated_company = "undefined";
        }
    }

    var JsonData = JSON.stringify(blogDetails);
    var fs = require('fs');
    fs.writeFile(`blogs/posts/${blogDetails.title.replace(/\s+/g, '-').toLowerCase()}.json`, JsonData, function (err) {
        if (err) {
            console.log(err);
        }
        console.log(`Saving ${blogDetails.title} File.`);
    });
});
