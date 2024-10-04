import React from 'react';
import './searchbar.css';
import { FaSearch } from "react-icons/fa";
const SearchBar = () => {
  return (
    <div >
      
      <input type="text" className='search m-md-3' placeholder=" Search" />
    </div>
  );
};

export default SearchBar;
