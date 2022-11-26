import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, firestore } from "../../config/Firebase";
import { doc, getDoc } from "firebase/firestore";
import "../../styles/landing.scss";

//search bar

function RecipeGallery() {
  //set state
  const [gallery, setGallery] = useState([]);
  const [query, setQuery] = useState("");

  //get array of all recipes in the recipe document
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((authObj) => {
      unsub();

      if (authObj) {
        const uid = auth.currentUser.uid;

        getDoc(doc(firestore, uid, "recipes"))
          .then((docSnap) => {
            if (docSnap.exists()) {
              setGallery(docSnap.data().recipes);
            } else {
              //change this line to instead render an icon/image
              console.log("No such document!");
            }
          })
          .catch((error) => {
            console.log("Error getting document: ", error);
          });
      } else {
        console.log("User not logged in");
      }
    });
  }, []);

  //reverse array to get most recent one first
  let reversedCards = gallery;
  let cards = [...reversedCards].reverse();

  //map over each recipe to render a recipe card
  const recipeCards = cards
    .filter((card) => {
      if (query === "") {
        return card;
      } else if (card.title.toLowerCase().includes(query.toLowerCase())) {
        return card;
      }
    })
    .map((card) => {
      const tags = card.tags.map((tag) => {
        return (
          <li key={tag} className="tag">
            {tag.toUpperCase()}
          </li>
        );
      });

      return (
        <div className="card" key={card.id}>
          <h4>{card.title}</h4>
          <ul id="tags">{tags}</ul>
          <p>{card.description}</p>
          <Link to={`${card.id}`}>View Recipe</Link>
        </div>
      );
    });

  return (
    <section>
      <header>
        <h1>My<br/>Cookbook<br/>Diary</h1>
      </header>
      <div className="main">
        <div id="search">
          <h1>My Recipes</h1>
          <input
            placeholder="Search for your recipes here"
            onChange={(e) => setQuery(e.target.value)}
          />  
        </div>
        
        <section id="recipe-gallery">{recipeCards}</section>
      </div>
    </section>
  );
}

export default RecipeGallery;
