import React, { useState } from 'react';

import {GroupedDishes, ExploreOtherBranches} from './components/GroupedDishes/GroupedDishes.js';
import { useHits, Configure, InstantSearch, SearchBox, Hits, Index } from 'react-instantsearch';

import 'instantsearch.css/themes/satellite.css';
import './App.css';
import CustomHit from './components/CustomHit/CustomHit.js';

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





function UI() {
  const [branchFilter, setBranchFilter] = useState(null);
  const [useGeolocation, setUseGeolocation] = useState(false);

  let restaurants = [];

  for (let i = 0; i < 10 ; i++) {
    restaurants.push(<div key={i} className="restaurant-item">
      <Index indexName='pick_me_dataset' indexId={i}>
        <GroupedDishes id={i} branchFilter={branchFilter} setBranchFilter={setBranchFilter}/>
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

