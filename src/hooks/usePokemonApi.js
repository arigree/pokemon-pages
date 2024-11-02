"use client";
import { createContext, useContext, useState } from "react";

const PokemonContext = createContext();

export function PokemonProvider({ children }) {
  const [pokemonState, setPokemonState] = useState({
    totalPokemonCount: 0,
    randomPokemon: [],
    searchResults: [],
    eggGroupPokemon:{},
    habitatPokemon: {},

  });

  async function getNumberOfPokemon() {
    const pokeResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/?limit=1`
    );
    const { count: pokemonCount } = await pokeResponse.json();
    setPokemonState({ ...pokemonState, totalPokemonCount: pokemonCount });
  }

  async function getRandomPokemon(limit = 5) {
    if (!pokemonState.totalPokemonCount) return [];
    const pokemonIds = {};
    let pokeIndex = 0;

    while (pokeIndex < limit) {
      const randId =
        parseInt(Math.random() * pokemonState.totalPokemonCount) + 1;

      if (!pokemonIds[randId]) {
        let idToUse = randId;
        if (idToUse > 1000) {
          idToUse = "10" + String(idToUse).slice(1);
        }
        const pokeRequest = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${idToUse}`
        );
        const pokeData = await pokeRequest.json();
        pokemonIds[randId] = pokeData;
        pokeIndex++;
      }
    }

    setPokemonState({
      ...pokemonState,
      randomPokemon: Object.values(pokemonIds),
    });
  }

  function getPokemonQuickInfo(pokeData) {
    return {
      name: pokeData.name,
      id: pokeData.id,
      img: pokeData.sprites.front_default,
      types: pokeData.types,
    };
  }
async function searchPokemon(query, filterType){
  let apiUrl= "";
  if (filterType === "name"){
    apiUrl = `https://pokeapi.co/api/v2/pokemon/${query}`;

  }else if (filterType === "egg-group"){
    apiUrl = `https://pokeapi.co/api/v2/egg-group/${query}`;
  
  }else if (filterType === "pokemon-habitat"){
    apiUrl = `https://pokeapi.co/api/v2/pokemon-habitat/${query}`
  };
  const response = await fetch(apiUrl);
  const data = await response.json();

  let resultData = [];
  if (filterType === "name"){
    resultData= [data];
  }else {
    const promises = data.pokemon_species.map(async (species) => {
      const pokeResponse = await fetch(species.url.replace("-species", ""));
      return await pokeResponse.json();

    });
    resultData = await Promise.all(promises)
  }
  setPokemonState({
    ...pokemonState,
    searchResults: resultData,
  });
}
async function getPokemonByEggGroup(){
  const response = await fetch("")
}



  const pokemonValues = {
    ...pokemonState,
    getNumberOfPokemon,
    getRandomPokemon,
    getPokemonQuickInfo,
    searchPokemon
  };

  return (
    <PokemonContext.Provider value={pokemonValues}>
      {children}
    </PokemonContext.Provider>
  );
}

export default function usePokemonApi() {
  return useContext(PokemonContext);
}