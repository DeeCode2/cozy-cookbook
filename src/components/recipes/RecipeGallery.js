//get array of all recipes with useEffect
//reverse array to get most recent one

import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { auth, firestore } from '../../config/Firebase';
import { doc, getDoc } from 'firebase/firestore'

function RecipeGallery() {
    //set state
    const [gallery, setGallery] = useState([]);

    //get array of all recipes in the recipe document
    useEffect(() => {
        const unsub = auth.onAuthStateChanged((authObj) => {
            unsub();

            if (authObj) {
                const uid = auth.currentUser.uid;

                getDoc(doc(firestore, uid, "recipes")).then(docSnap => {
                    if (docSnap.exists()) {
                        setGallery(docSnap.data().recipes);
                    } else {
                        //change this line to instead render an icon/image
                        console.log("No such document!");
                    }
                }).catch((error) => {
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
    const recipeCards = cards.map((card) => {

        // const hours = card.time.slice(0,2)
        // const mins = card.time.slice(3,5)
        const tags = card.tags.map((tag) => {
            return (  
                <span key={tag} className="tag">{tag.toUpperCase()}</span>
            );
        })

        return (
            <div className="card" key={card.id}>
                <h4>{card.title}</h4>
                <div id="tags">{tags}</div>
                <p>{card.description}</p>
                {/* <div className="time-link">
                    {hours > 0 && <span className="time">{hours} hr&nbsp;</span>}
                    {mins > 0 && <span className="time"> {mins} min</span>}
                </div> */}
                <Link to={`${card.id}`}>View Recipe</Link>
            </div>
        );
    });

    return (
        <section id="recipe-gallery">
            {recipeCards}
        </section>
    );
};

export default RecipeGallery;