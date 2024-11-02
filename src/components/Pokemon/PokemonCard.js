"use client";
import pokemonStyles from "./pokemon.module.css";
import usePokemonApi from "@/hooks/usePokemonApi";


export default function PokemonCard({ id, img = "", name = "", types = [] }) {
  const { addFavorite, removeFavorite, isFavorite } = usePokemonApi();

  const typesJsx = types.map((typeObj) => typeObj.type.name).join(", ");

  const handleFavoriteClick = () => {
    console.log("hello??")
    if (isFavorite(id)){
      removeFavorite(id);
    } else {
      addFavorite({id, name, img, types});
    }
  }
  
  return (
    <div className={pokemonStyles.pokeCard}>
      <img src={img} />
      <div>
        <h4>{name}</h4>
        <p>
          <i>Types: {typesJsx}</i>
        </p>
        <button onClick={handleFavoriteClick}>{isFavorite(id) ? "Add/Remove from Favorites" : "Add/Remove from Favorites"}</button>
      </div>
    </div>
  );
}