import React, { useState } from 'react';


import { useHits, Configure, InstantSearch, SearchBox, Hits, Index } from 'react-instantsearch';

import 'instantsearch.css/themes/satellite.css';
import CustomHit from '../CustomHit/CustomHit.js';

export function GroupedDishes({  branchFilter, setBranchFilter}, props) {
    const { results } = useHits(props);
  
    const { hits } = results;
  
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
        <Hits hitComponent={CustomHit} classNames={{ list: 'dish-list', item: 'dish-item' }} escapeHTML={true} />
        {!branchFilter ? <ExploreOtherBranches num={1} setBranchFilter={setBranchFilter} restaurant_enseigne_id={hits[0].restaurant.enseigne_ids[0]} /> : ''}
      </div>
  
    )
  }
  
 export function ExploreOtherBranches({ restaurant_enseigne_id, setBranchFilter }) {
  
    const handleSubmit = (event) => {
      event.preventDefault(); 
      setBranchFilter(`restaurant.enseigne_ids:'${restaurant_enseigne_id.replace(/'/g, "\\'")}'`);
    };
  
    return (
      <form onSubmit={handleSubmit} className="explore-other">
        <button type="submit" className="full-width-button">Explore other Branches</button>
      </form>
    );
  }

