"use client";
import usePokemonApi from "@/hooks/usePokemonApi";
import { useEffect } from "react";
import homeStyles from "./page.module.css";
import PokemonCard from "@/components/Pokemon/PokemonCard";

export default function Home() {
  const pokeData = usePokemonApi();

  useEffect(() => {
    if (pokeData.totalPokemonCount === 0) {
      pokeData.getNumberOfPokemon();
    }
    if(!pokeData.randomPokemon.length){
      pokeData.getRandomPokemon();
    }
  }, [pokeData]);

  console.log(pokeData);
  return (
    <main className={homeStyles.mainContent}>
      <h1>POKEMON SHOWCASE</h1>
      <section>
        <PokemonCard />
        <PokemonCard />
        <PokemonCard />
      </section>
    </main>
  );
}