var request = require('request');
var cheerio = require('cheerio');

var criteriaAnswer =[];
var criteriaQuestion = [];
var employerCriteria = {}
request('https://www.work180.com.au/clients/accenture', function (error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        $('.sh.row.feature-row.row-eq-height').each(function (i, element) {
            var a = $(this).children().eq(2);
            var q = $(this).children().eq(1);
            criteriaAnswer.push(a.text().trim());
            criteriaQuestion.push(q.text().trim());
        });
    }
    for(i = 0; i < criteriaQuestion.length; i ++)
    {
        employerCriteria[criteriaQuestion[i]] = criteriaAnswer [i];
    }
    console.log(employerCriteria);
});