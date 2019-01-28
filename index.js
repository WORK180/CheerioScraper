var request = require('request');
var cheerio = require('cheerio');
var argv = require('minimist')(process.argv.slice(2));

var criteriaAnswer = [];
var criteriaQuestion = [];
var employer = argv._[0];
var employerName = "";
for (i = 1; i < argv._.length; i++) {
    employerName = employerName + " " + argv._[i];
}
var employerCriteria = {
    "employer": employerName.trim(),
    "slug": `${employer}`,
    "criteria": [],
    "description": ""
};

var employerDetails = {

}



request(`https://www.work180.com.au/clients/${employer}`, function (error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        $('.sh.row.feature-row.row-eq-height').each(function (i, element) {
            var a = $(this).children().eq(2);
            var q = $(this).children().eq(1);
            criteriaAnswer.push(a.text().trim());
            criteriaQuestion.push(q.text().trim());
        });
        employerCriteria.description = $('#client-content').html();
    }
    for (i = 0; i < criteriaQuestion.length; i++) {
        var jsonElement = {
            "question": criteriaQuestion[i],
            "answer": criteriaAnswer[i]
        };
        employerCriteria.criteria.push(jsonElement);
    }

    var JsonData = JSON.stringify(employerCriteria);
    var fs = require('fs');
    fs.writeFile(`results/employer-initiatives-${employer}.json`, JsonData, function (err) {
        if (err) {
            console.log(err);
        }
        console.log(`Saving ${employer} File.`);
    });
});
