"use client";
import pokemonStyles from "@/components/Pokemon/pokemon.module.css";

export default function PokemonCard({ img = "", name = "", types = [] }) {
  return (
    <div className={pokemonStyles.pokeCard}>
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png" />
      <div>
        <h4>Meowth</h4>
        <p>
          <i>Types: Normal</i>
        </p>
      </div>
    </div>
  );
}