import React, { useState, useEffect } from 'react';

import algoliasearch from 'algoliasearch/lite';
import {useInstantSearch,useHits,Configure, InstantSearch, SearchBox, RefinementList, Hits, Index } from 'react-instantsearch';

// Or include the full Satellite theme
import 'instantsearch.css/themes/satellite.css';

import { useLocation } from 'react-router-dom';
import './RestaurantTab.css';

const searchClient = algoliasearch('RSBCBF0EG8', 'c0b456bb9f236590b9694256a72867de');

// Custom hit component to display image on the right and title on the left
function Hit({ hit }) {
  return (
    <div className="branch-item">
      <div className='dish-details'>
        <h2>{hit.restaurant.name}</h2>
      </div>
      <img src={hit.restaurant.img} alt={hit.name} />
      <div className="image-overlay"></div> 

    </div>
  );
}



function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function RestaurantsTab() {
  const queryParam = useQuery();
  const [query, setQuery] = useState('');

  return (
    <InstantSearch searchClient={searchClient} indexName="pick_me_demo">
      <SearchBox defaultRefinement={query} />
      <Configure query={query} />
      <Hits hitComponent={Hit} classNames={{list: 'branch-list', item: 'branch-item'}} />
    </InstantSearch>
  );
}
  
export default RestaurantsTab;
