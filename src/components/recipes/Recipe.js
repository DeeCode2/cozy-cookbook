import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { auth, firestore } from "../../config/Firebase";
import { doc, getDoc } from "firebase/firestore";
import "../../styles/recipe.scss";

function Recipe() {
  const [ingArr, setIngArr] = useState([]);
  const [tagArr, setTagArr] = useState([]);
  const [userId, setUserId] = useState("");
  const [recipeCard, setRecipeCard] = useState([]);
  const [listData, setListData] = useState([]);

  const { recId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((authObj) => {
      unsub();

      if (authObj) {
        const uid = auth.currentUser.uid;
        setUserId(uid);
        getDoc(doc(firestore, uid, "recipes"))
          .then((docSnap) => {
            if (docSnap.exists()) {
              //binary search of recipes
              function searchRecipes(targetId, recipeArr) {
                let start = 0;
                let end = recipeArr.length - 1;

                while (start <= end) {
                  let middle = Math.floor((start + end) / 2);
                  if (recipeArr[middle].id === targetId) {
                    setRecipeCard(recipeArr[middle]);
                    setTagArr(recipeArr[middle].tags);
                    setIngArr(recipeArr[middle].ingredients);
                    return middle;
                  } else if (recipeArr[middle].id < targetId) {
                    start = middle + 1;
                  } else {
                    end = middle - 1;
                  }
                }
                return -1;
              }

              searchRecipes(Number(recId), docSnap.data().recipes);
            } else {
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

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((authObj) => {
      unsub();

      if (authObj) {
        const uid = auth.currentUser.uid;
        setUserId(uid);
        getDoc(doc(firestore, uid, "shopping lists"))
          .then((docSnap) => {
            if (docSnap.exists()) {
              setListData(docSnap.data().lists)
            } else {
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

  return (
    <main>
      <section id="recipe-detail">

        <div id="recipe split-left">
          <ul id="tags">
            {tagArr.map((tag) => {
              return <li key={tag}>{tag.toUpperCase()}</li>;
            })}
          </ul>
          <h1>{recipeCard.title}</h1>
          <p>{recipeCard.description}</p>
          <div id="buttons">
          <Link to={"../recipes"} className="btn yellow-btn return-btn">Return</Link>
            <Link to={"edit"} className="btn green-btn edit-btn">Edit</Link>
            {/* <button type="button">Add to shopping list</button> */}
          </div> 
        </div>

        <div id="split-right">
          <h2>Ingredients</h2>
          <ul id="ingredients">
              {ingArr.map((ing) => {
                return <li key={ing}>{ing}</li>;
              })}
            </ul>
            <p>{recipeCard.notes}</p> 
        </div> 
        
      </section>

      
    </main>
  );
}

export default Recipe;