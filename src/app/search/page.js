"use client";

import usePokemonApi from "@/hooks/usePokemonApi";
import { useState } from "react";
import PokemonCard from "@/components/Pokemon/PokemonCard";



export default function Search() {
  
  const [searchInput, setSearchInput] =useState("");
  const [filterType, setFilterType] = useState("name");
  const pokeData = usePokemonApi();

  const handleSearch = () => {
    pokeData.searchPokemon(searchInput.toLowerCase(), filterType);
  };

  const searchResults = pokeData.searchResults.map((pokemon) => {
    const quickInfo = pokeData.getPokemonQuickInfo(pokemon);
    return (
      <PokemonCard
      key={`search-poke-card-${quickInfo.id}`}
      name={quickInfo.name}
      img={quickInfo.img}
      types={quickInfo.types}/>
    );
  });
    
    // function searchResult(){
    //     console.log("Hello?");
    // }

  return (
    <main>
      <h1>search</h1>
        <input
        type="test" 
        value={searchInput} 
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="search):("></input>
        <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="egg-group">Egg Group</option>
          <option value="pokemon-habitat">Habitiat</option>

        </select>
        <button onClick={handleSearch}>Search</button>
        <section>{searchResults}</section>
    </main>
  );
}