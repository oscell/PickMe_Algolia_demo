import React, { useState } from 'react';
import { Snippet} from 'react-instantsearch';


import { useHits, Configure, InstantSearch, SearchBox, Hits, Index } from 'react-instantsearch';

import 'instantsearch.css/themes/satellite.css';
import './Search.css';


const customSearchClient = {
  search(requests) {
    return fetch('http://localhost:4000/search', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      return data;
    });
  },

};


// Custom hit component to display image on the right and title on the left
function Hit({ hit }) {

  
hit._snippetResult.description.value = hit._snippetResult.description.value.replace('&lt;em&gt;', '').replace('&lt;/em&gt;', '')
console.log('hit', hit);
return (
    <div className="hit-item">
      <div className='dish-details'>
        <div className='dish-name'>{hit.name}</div>
        <div className='dish-price'>Price: {hit.price}$</div>
        <Snippet hit={hit} attribute={"description"}/>
    
        

        </div>
      <img src={hit.img} alt={hit.name} />
    </div>
  );
}


function ExploreOtherBranches({ num, query, restaurant_enseigne_id, setBranchFilter }) {

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submit action
    setBranchFilter(`restaurant.enseigne_ids:'${restaurant_enseigne_id.replace(/'/g, "\\'")}'`);
  };

  return (
    <form onSubmit={handleSubmit} className="explore-other">
      <button type="submit" className="full-width-button">Explore other Branches</button>
    </form>
  );
}


function ResultsGroupedByRestaurantName({ id , branchFilter, setBranchFilter}, props) {
  const { results } = useHits(props);

  const { hits, nbHits } = results;

  console.log('hits', results.query);

  if (!hits || hits.length === 0) {
    return <div></div>;
  }

  return (

    <div className='grouped-restaurants'>
      <div className='grouped-restaurants-banner'>
        <h2>{hits[0].restaurant.name}</h2>
        <img src={hits[0].restaurant.img} alt={hits[0].restaurant.name} />
        <div className="image-overlay"></div>
      </div>
      <Hits hitComponent={Hit} classNames={{ list: 'dish-list', item: 'dish-item' }} escapeHTML={true} />
      {!branchFilter ? <ExploreOtherBranches num={1} setBranchFilter={setBranchFilter} restaurant_enseigne_id={hits[0].restaurant.enseigne_ids[0]} /> : ''}
    </div>

  )
}


function UI() {
  const [branchFilter, setBranchFilter] = useState(null);
  const [useGeolocation, setUseGeolocation] = useState(false);

  let restaurants = [];

  for (let i = 0; i < 10 ; i++) {
    restaurants.push(<div key={i} className="restaurant-item">
      <Index indexName='pick_me_dataset' indexId={i}>
        <ResultsGroupedByRestaurantName id={i} branchFilter={branchFilter} setBranchFilter={setBranchFilter}/>
      </Index>
    </div>)
  }

  return (
    <InstantSearch searchClient={customSearchClient} indexName="pick_me_dataset" routing={true}>
      <div className='search-header'>
      {branchFilter ? <button className='clear-button' onClick={e => setBranchFilter(null)}>Clear</button> : ''}
      <button className='location-button' onClick={e => setUseGeolocation(!useGeolocation)}>Localise me</button>
      <SearchBox />
      {branchFilter ? <Configure filters={branchFilter} /> : ''}
      {useGeolocation ? <Configure aroundLatLng='51.5174005, -0.0827166' /> : ''}
      </div>

      <div className='restaurant-list'>
        {restaurants}
      </div>
    </InstantSearch>
  );
}

export default UI;

