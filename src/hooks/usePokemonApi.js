"use client";
import { createContext, useContext, useEffect, useState } from "react";

const PokemonContext = createContext();

export function PokemonProvider({ children }) {
  const [pokemonState, setPokemonState] = useState({
    totalPokemonCount: 0,
    randomPokemon: [],
    searchResults: [],
    eggGroupPokemon: {},
    habitatPokemon: {},
    favorites: [],
  });

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setPokemonState((prevState) => ({
      ...prevState,
      favorites: storedFavorites,
    }));
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(pokemonState.favorites));
  }, [pokemonState.favorites]);

  const addFavorite = (pokemon) => {
    if (!pokemonState.favorites.some((fav) => fav.id === pokemon.id)) {
      setPokemonState({
        ...pokemonState,
        favorites: [...pokemonState.favorites, pokemon],
      });
    }
  };

  const removeFavorite = (pokemonId) => {
    setPokemonState({
      ...pokemonState,
      favorites: pokemonState.favorites.filter((fav) => fav.id !== pokemonId),
    });
  };

  const isFavorite = (pokemonId) => {
    return pokemonState.favorites.some((fav) => fav.id === pokemonId);
  };


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
  async function searchPokemon(query, filterType) {
    let apiUrl = "";
    if (filterType === "name") {
      apiUrl = `https://pokeapi.co/api/v2/pokemon/${query}`;
    } else if (filterType === "egg-group") {
      apiUrl = `https://pokeapi.co/api/v2/egg-group/${query}`;
    } else if (filterType === "pokemon-habitat") {
      apiUrl = `https://pokeapi.co/api/v2/pokemon-habitat/${query}`;
    }
    const response = await fetch(apiUrl);
    const data = await response.json();

    let resultData = [];
    if (filterType === "name") {
      resultData = [data];
    } else {
      const promises = data.pokemon_species.map(async (species) => {
        const pokeResponse = await fetch(species.url.replace("-species", ""));
        return await pokeResponse.json();
      });
      resultData = await Promise.all(promises);
    }
    setPokemonState({
      ...pokemonState,
      searchResults: resultData,
    });
  }
  async function getPokemonByEggGroup() {
    //if my laptop must crash loading pokemon.. so must yours (it broke it when i added limites D: )
    const response = await fetch("https://pokeapi.co/api/v2/egg-group/");
    const { results: eggGroups } = await response.json();


    const eggGroupData = {};
    for(const group of eggGroups){
      const groupResponse = await fetch (group.url);
      const groupData = await groupResponse.json();

      eggGroupData[group.name] = await Promise.all(
        groupData.pokemon_species.map(async (species) => {
          const speciesReponse = await fetch(
            species.url.replace("-species", "")
          );
          return await speciesReponse.json();
        })
      );
    }
    setPokemonState({ ...pokemonState, eggGroupPokemon: eggGroupData});
  
  }

  async function getPokemonByHabitat() {
    const habitatResponse = await fetch("https://pokeapi.co/api/v2/pokemon-habitat/");
    const {results: habitats} = await habitatResponse.json();
  
    const habitatData ={};
   
    for (const habitat of habitats) {
      const habitatResponse = await fetch(habitat.url);
      const habitatDataResponse = await habitatResponse.json();

      habitatData[(habitat.name)] = await Promise.all(
        habitatDataResponse.pokemon_species.map(async (species) => {
          const speciesReponse = await fetch(
            species.url.replace("-species", "")
          );
          return await speciesReponse.json();
        })
      );
    }
    setPokemonState({ ...pokemonState, habitatPokemon: habitatData });
  }
  //offical miss-spell habitat count: 6

  const pokemonValues = {
    ...pokemonState,
    getNumberOfPokemon,
    getRandomPokemon,
    getPokemonQuickInfo,
    searchPokemon,
    getPokemonByEggGroup,
    getPokemonByHabitat,
    addFavorite,
    removeFavorite,
    isFavorite,
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