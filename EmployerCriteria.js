var request = require('request');
var cheerio = require('cheerio');
var argv = require('minimist')(process.argv.slice(2));

var criteriaAnswer = [];

var employer = argv._[0];
var employerName = "";
for (i = 1; i < argv._.length; i++) {
    employerName = employerName + " " + argv._[i];
}

var employerCriteria = {
    "employer": employerName.trim(),
    "slug": `${employer}`,
    "criteria": []
};

var criteriaQuestion = [
    "Open to discussing flexible working arrangements at the interview stage?",
    "Employer is a Pay Equity Ambassador*",
    "Paid Parental Leave at full salary for primary carer (not including government-funded parental leave)",
    "Paid Parental Leave at full salary for secondary carer",
    "Minimum tenure required to be eligible for Paid Parental Leave",
    "Continuation of superannuation payments whilst on paid Parental Leave",
    "Continuation of superannuation payments whilst on unpaid Parental Leave",
    "Programs for parents returning to work after Parental Leave",
    "Opportunities to purchase leave",
    "Employee Assistance Program (EAP)",
    "Breastfeeding rooms",
    "Leadership development programs",
    "Mentoring opportunities",
    "Coaching programs",
    "Targets to raise the number of women in leadership",
    "Domestic and Family Violence policy",
    "Internal Women's networking groups",
    "Employee engagement scores year on year",
    "Employee turnover rate",
    "Paid volunteer days"
];


request(`https://au.work180.co/employer/${employer}`, function (error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        $('table > tbody > tr > td').each(function (i, element) {
            var a = $(this);
            console.log(a.text().trim() );
            if (a.text().trim() != "") {
            criteriaAnswer.push(a.text().trim());
            } else {
                //criteriaAnswer.push(a.children());
                //console.log($("#{a} > i"));
            }

        });
    }
    for (i = 0; i < criteriaQuestion.length; i++) {
        if (criteriaAnswer[i] !== "") {
            var jsonElement = {
                "question": criteriaQuestion[i],
                "answer": criteriaAnswer[i]
            };
        } else {
            var jsonElement = {
                "question": criteriaQuestion[i],
                "answer": "Symbol Found"
            };
        }
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
