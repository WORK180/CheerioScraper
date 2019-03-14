To run employer criteria and csv:
```cat params.txt | while read -r param; do node EmployerCriteria.js $param; done```

To run employer criteria and details: 
```cat params.txt | while read -r param; do node index.js $param; done```

To run blog post scraping:
```cat blogIndex.txt | while read -r param; do node blogPosts.js $param; done```
