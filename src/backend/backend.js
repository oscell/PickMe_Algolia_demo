const express = require('express');


const algoliasearch = require('algoliasearch');
const app = express();
const cors = require('cors');
app.use(cors()); // This will enable all CORS requests. For security, configure it appropriately for your needs.
app.use(express.json());


const algoliaClient = algoliasearch('C4LR07FCFH', 'e8f646c777be3683e25f189cccd36784');
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