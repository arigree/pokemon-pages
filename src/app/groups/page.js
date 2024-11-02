"use client";

import { useEffect } from "react";
import usePokemonApi from "@/hooks/usePokemonApi";
import PokemonCard from "@/components/Pokemon/PokemonCard";
import groupStyles from "@/app/groups/group.module.css";


export default function Groups() {
  const pokeData = usePokemonApi();

  useEffect(() => {
    if(!Object.keys(pokeData.eggGroupPokemon).length){
      pokeData.getPokemonByEggGroup();
    }
    if (!Object.keys(pokeData.habitatPokemon).length){
      pokeData.getPokemonByHabitat();
    }
  }, [pokeData]);

  const loadPokemonList = (pokemonList) => {
    return pokemonList.map((pokemon) => {
      const quickInfo = pokeData.getPokemonQuickInfo(pokemon);
      return (
        <PokemonCard
        key={`group-poke-card-${quickInfo.id}`}
        name={quickInfo.name}
        img={quickInfo.img}
        types={quickInfo.types}/>
      );
    });
  };
  
    return (
      <main>
        <h1>groups</h1>
       <section className={groupStyles.container}>
        
          <h2>Egg Groups</h2>
        {Object.keys(pokeData.eggGroupPokemon).map((groupName) =>(
          <div key={`egg-group-${groupName}`}>
            <h3>{groupName}</h3>
            <div className={groupStyles.egg}>{loadPokemonList(pokeData.eggGroupPokemon[groupName])}</div>
          </div>
        ))}
       
        
        <h2>Habitats</h2>
        {Object.keys(pokeData.habitatPokemon).map((habitatName) =>(
          <div key={`habitat-${habitatName}`}>
            <h3>{habitatName}</h3>
            <div className="habitat">{loadPokemonList(pokeData.habitatPokemon[habitatName])}</div>
          </div>
        ))}
       </section>
      </main>
    );
  }