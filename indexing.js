// hello_algolia.js
const algoliasearch = require('algoliasearch')

// Connect and authenticate with your Algolia app
const client = algoliasearch('RSBCBF0EG8', 'c0b456bb9f236590b9694256a72867de')

// Create a new index and add a record
const index = client.initIndex('pick_me_demo')

index.search('burger')