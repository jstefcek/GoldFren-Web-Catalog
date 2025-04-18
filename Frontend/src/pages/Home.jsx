import React from 'react';
import SearchForm from '../components/Home/SearchForm';

function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center mt-4">Search Goldfren catalog</h1>
      <SearchForm />
    </div>
  );
}

export default Home;