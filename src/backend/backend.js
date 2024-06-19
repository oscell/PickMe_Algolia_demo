const fs = require('fs');
const readline = require('readline');

// Function to check and create .env file from .env.template
function setupEnvFile() {
    const envPath = './.env';
    const templatePath = './.env.template';

    if (!fs.existsSync(envPath)) {
        if (fs.existsSync(templatePath)) {
            fs.copyFileSync(templatePath, envPath);
            console.log('.env file created from .env.template');

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            // Prompt for APP_ID
            rl.question('Enter your APP_ID: ', (appId) => {
                // Prompt for API_KEY
                rl.question('Enter your API_KEY: ', (apiKey) => {
                    // Write these values to the .env file
                    const envContent = `APP_ID=${appId}\nAPI_KEY=${apiKey}\n`;
                    fs.writeFileSync(envPath, envContent);

                    console.log('APP_ID and API_KEY set in .env file');
                    rl.close();

                    // Continue initializing the server only after setting up the .env file
                    startServer();
                });
            });
        } else {
            console.error('Error: .env.template file does not exist.');
            process.exit(1);
        }
    } else {
        console.log('.env file already exists.');
        startServer();
    }
}


function startServer() {
    const express = require('express');
    require('dotenv').config();

    const algoliasearch = require('algoliasearch');
    const app = express();
    const cors = require('cors');
    
    app.use(cors());
    app.use(express.json());

    const algoliaAppId = process.env.APP_ID;
    const algoliaApiKey = process.env.API_KEY;

    console.log('Using Algolia App ID:', algoliaAppId);

    const algoliaClient = algoliasearch(algoliaAppId, algoliaApiKey);
    const index = algoliaClient.initIndex('pick_me_dataset');


app.post('/search', async ({ body }, res) => {
    const { requests } = body;
    
    let queries = [];
    let response = [];

    if (requests && requests.length > 0) {
        // Create the first distinct query for initial filtering by restaurant name

        let firstResult = await index.search(requests[0].params.query,{distinct: true,hitsPerPage:requests.length-1, ...requests[0].params});

        // Append additional queries as needed, now not distinct
        for (let i = 0; i < firstResult.hits.length; i++) {
            queries.push({
                indexName: requests[0].indexName,
                query: firstResult.query,
                params: {
                    filters: `restaurant.id:${firstResult.hits[i].restaurant.id}`, // Each query filters by the same restaurant name
                    distinct: false,
                }
            });
        }


     
    const results = await algoliaClient.multipleQueries(queries);

    response = [firstResult, ...results.results];

    for (let i = response.length; i < requests.length; i++) {
        response.push({    
            hits: [],
            nbHits: 0,
            page: 0,
            nbPages: 1,
            hitsPerPage: 20,
            exhaustiveNbHits: true,
            exhaustiveTypo: true,
            query: '',
            params: 'filters=restaurant.id%3A6&distinct=false',
            index: 'pick_me_dataset',
            renderingContent: {},
            processingTimeMS: 1,
            serverTimeMS: 9
          });
        }

}
    res.status(200).send({results:response});
});


  app.post('/sffv', async ({body}, res) => {
    const { requests } = body;
    const results = await algoliaClient.searchForFacetValues(requests);
    res.status(200).send(results);
  });
  

  app.listen(4000, () => {
    console.log('Server listening on port 4000');
  });

}

setupEnvFile()
