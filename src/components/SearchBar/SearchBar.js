import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value); // Trigger search whenever the search term changes
  };

  return (
    <div className="search-bar">
      <div className="search-bar__container">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for Restaurants by Name, Cuisine, Location"
          className="search-bar__input"
        />

      </div>
    </div>
  );
};

export default SearchBar;
