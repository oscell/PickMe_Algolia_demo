import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


import algoliasearch from 'algoliasearch/lite';
import {useInstantSearch,useHits,Configure, InstantSearch, SearchBox, RefinementList, Hits, Index } from 'react-instantsearch';
// Include only the reset
// import 'instantsearch.css/themes/reset.css';

// Or include the full Satellite theme
import 'instantsearch.css/themes/satellite.css';
import './Search.css';


const searchClient = algoliasearch('RSBCBF0EG8', 'c0b456bb9f236590b9694256a72867de');



// Custom hit component to display image on the right and title on the left
function Hit({ hit }) {
  return (
    <div className="hit-item">
      <div className='dish-details'>
        <div className='dish-name'>{hit.name}</div>
        <div className='dish-price'>Price: {hit.price}$</div>
      </div>
      <img src={hit.img} alt={hit.name} />
    </div>
  );
}

function ExploreOtherBranches({ num,query }) {
  let navigate = useNavigate();

  const handleSubmit = (event) => {
      event.preventDefault(); // Prevent the default form submit action
      navigate(`/restaurants?query=${encodeURIComponent(query)}`); // Navigate with query
  };

  return (
      <form onSubmit={handleSubmit} className="explore-other">
          <button type="submit" className="full-width-button">Explore other Branches {num}</button>
      </form> 
  );
}



function ResultsGroupedByRestaurantName({ id, restaurant, dishName, query }) {
  const [hitsCount, setHitsCount] = useState(0); // State to store the number of hits
  const restaurantIdFilter = [`restaurant.id:${restaurant.id}`];
  const index = searchClient.initIndex('pick_me_demo');


  useEffect(() => {
    // Perform the search whenever the component mounts or the query changes
    index.search(query, {
      distinct: false,
      facetFilters: [restaurantIdFilter]
    }).then(({ hits }) => {
      setHitsCount(hits.length); // Update the hits count state
    }).catch(error => {
      console.error('Search failed:', error);
    });
  }, [query]); // Dependency array, ensures the effect runs when query changes

  return (
    <div className='grouped-restaurants'>
      <div className='grouped-restaurants-banner'>
        <h2>{restaurant.name}</h2>
        <img src={restaurant.img} alt={restaurant.name} />
        <div className="image-overlay"></div> 
      </div>
      <Index indexName='pick_me_demo' indexId={id}>
        <Configure
          analytics={false}
          distinct={false}
          query={query}
          facetFilters={[restaurantIdFilter]}
        />
        <Hits hitComponent={Hit} classNames={{list: 'dish-list', item: 'dish-item'}} />
      </Index>
      <ExploreOtherBranches num={hitsCount}/> {/* Pass hitsCount instead of id */}
    </div>
  );
}






function CustomHits() {
  const { results } = useHits();

  // Log the structure of the first hit to confirm expected data structure
  // console.log("Search Results:", results);

  // Create an array to hold JSX elements
  let hitsJSX = [];

  if (results && results.hits) {
    for (let i = 0; i < results.hits.length; i++) {
      let hit = results.hits[i];
      hitsJSX.push(
        <div key={hit.objectID} className="restaurant-item">
          <ResultsGroupedByRestaurantName id={i} restaurant={hit.restaurant} dishName={hit.name} query={results.query} />
        </div>
      );
    }
  }

  return <div>{hitsJSX}</div>;
}



function UI() {
  const [query, setQuery] = useState(''); // Start with an empty query

  return (
    <InstantSearch searchClient={searchClient} indexName="pick_me_demo" routing={true}    >
      <SearchBox query={query}/>
      {/* <RefinementList attribute="price" /> */}
      <div className='restaurant-list'><CustomHits> </CustomHits></div>
    </InstantSearch>
  );
}

export default UI;

