"use client";
import { createContext, useContext, useState } from "react";

const PokemonContext = createContext();

export function PokemonProvider({ children }) {
  const [pokemonState, setPokemonState] = useState({
    totalPokemonCount: 0,
  });

  async function getNumberOfPokemon() {
    const pokeResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/?limit=1`
    );
    const { count: pokemonCount} = await pokeResponse.json();
    setPokemonState({ ...pokemonState, totalPokemonCount: pokemonCount });
  }
  
  async function getRandomPokemon(limit = 5){
    const pokemonIds = {};
    let pokeIndex = 0;

    while(pokeIndex < limit){
      const ranID = parseInt(Math.random() * pokemonState.totalPokemonCount) + 1;
      pokemonIds[ranID] = {}
      pokeIndex++;
    }
    console.log(pokemonIds)
  };

  const pokemonValues = { ...pokemonState, getNumberOfPokemon };

  return (
    <PokemonContext.Provider value={pokemonValues}>
      {children}
    </PokemonContext.Provider>
  );
}
export default function usePokemonApi() {
  return useContext(PokemonContext);
}
