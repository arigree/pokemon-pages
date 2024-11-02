"use client";

import usePokemonApi from "@/hooks/usePokemonApi";
import PokemonCard from "@/components/Pokemon/PokemonCard";

export default function Favorites(){
    const {favorites } = usePokemonApi();

    return(
        <main>
            <h1>favorites</h1>
            {favorites.length > 0 ? (
                favorites.map((pokemon) =>(
                    <PokemonCard
                    key={`favorite-poke-card-${pokemon.id}`}
                    id={pokemon.id}
                    name={pokemon.name}
                    img={pokemon.img}
                    types={pokemon.types}/>
                ))
            ) : (
                <p>No favorite pokemon ):(</p>
            )
        }
        </main>

    );
}