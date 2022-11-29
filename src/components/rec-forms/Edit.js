import React, { useRef, useEffect, useState} from "react";
import { Navigate, useNavigate, useParams  } from "react-router-dom";
import { auth, firestore } from '../../config/Firebase';
import { updateDoc, doc, arrayUnion, getDoc } from 'firebase/firestore';
import "../../styles/recForms.scss";

function Edit() {

    //get current input values with useRef
    const recTitle = useRef();
    const recTag = useRef();
    const recDesc = useRef();
    const recIng = useRef();
    const recNotes = useRef();
    //const recTime = useRef();

    //set state for each value
    const [ingArr, setIngArr] = useState([]);
    const [tagArr, setTagArr] = useState([]);
    const [userId, setUserId] = useState("");
    const [recipeCard, setRecipeCard] = useState([]);
    const [newRecipeData, setNewRecipeData] = useState([]);

    const { recId } = useParams();
    const navigate = useNavigate();

    //get list of correct recipes
    useEffect(() => {
        const unsub = auth.onAuthStateChanged((authObj) => {
            unsub();

            if (authObj) {
                const uid = auth.currentUser.uid;
                setUserId(uid);
                getDoc(doc(firestore, uid, "recipes")).then(docSnap => {
                    if (docSnap.exists()) {
                        
                        

                        //binary search of recipes
                        function searchRecipes(targetId, recipeArr) {
                            let start = 0;
                            let end = recipeArr.length - 1;
                          
                            while (start <= end) {
                              let middle = Math.floor((start + end) / 2);
                              if (recipeArr[middle].id === targetId) {

                                setRecipeCard(recipeArr[middle])
                                setTagArr(recipeArr[middle].tags)
                                setIngArr(recipeArr[middle].ingredients)
                                return middle;
                              } else if (recipeArr[middle].id < targetId) {
                                start = middle + 1;
                              } else {
                                end = middle - 1;
                              }
                            }
                            return -1;
                        }

                        setNewRecipeData(docSnap.data().recipes.filter(rec => rec.id !== Number(recId)))
                        searchRecipes(Number(recId), docSnap.data().recipes)

                        //setTagArr(recipeCard.tags)
                    } else {
                        console.log("No such document!");
                    }
                }).catch((error) => {
                    console.log("Error getting document: ", error);
                });
            } else{
                console.log("User not logged in");
            }
        });
    }, []);

    

    //remove ingredient/tag from array when delete ingredient/tag button is clicked
    function deleteIngredient(e) {
        setIngArr(prevIngArr => {
            return(
                [...prevIngArr.filter((ing) => {
                    return ing !== e.target.value
                })]
            );
        });
    };

    function deleteTag(e) {
        setTagArr(prevTagArr => {
            return(
                [...prevTagArr.filter((tag) => {
                    return tag !== e.target.value
                })]
            );
        });
    };

    //add tag to array of ingredients when add button is clicked
    function addIng() {
        if (recIng.current.value.length === 0) {
            console.log("The textbox is empty")
        } else {
            setIngArr(prevIngArr => {
                return (
                    [...prevIngArr, recIng.current.value]
                )
            })
        }
    }

    //add tag to array of tags when add button is clicked
    function addTag() {
        if (recTag.current.value.length === 0) {
            console.log("The textbox is empty")
        } else {
            setTagArr(prevTagArr => {
                return (
                    [...prevTagArr, recTag.current.value]
                )
            })
        }
    }

    //delete recipe if use clicks delete button
    function deleteRecipe() {
        try {
            //const ref = doc(firestore, uid, "recipes");
            updateDoc(doc(firestore, userId, "recipes"), {
              recipes: newRecipeData,
            });
  
            //navigate back to recipe gallery
            setTimeout(() => {
              window.location = "/recipes";
            }, 2000);
  
            setTimeout();
          } catch (err) {
            console.log(err.message);
          }
    }

    //map over arrays of tags and buttons to render buttons
    const ingredientButtons = ingArr.map(ing => {
        return (
            <button
                className="btn blue-btn"
                value={ing}
                key={ing}
                onClick={(e) => {
                    deleteIngredient(e)
                }}>
                {ing.toUpperCase()}
            </button>
        );
    });

    const tagButtons = tagArr.map(tag => {
        return (
            <button
                className="btn blue-btn"
                value={tag}
                key={tag}
                onClick={(e) => {
                    deleteTag(e)
                }}>
                {tag.toUpperCase()}
            </button>
        );
    });

    //cancel submission
    function cancelSubmission() {
        navigate(-1)
    }

    // //save new recipe to firestore database
    const handleSave = async (e) => {
        e.preventDefault();

        document.getElementById("button-list").innerHTML = "";

        //create new data object to replace unedited recipe with
        const newRecipe = {
            title: recTitle.current.value,
            //time: recTime.current.value,
            description: recDesc.current.value,
            ingredients: ingArr,
            tags: tagArr,
            notes: recNotes.current.value,
            id: Number(recId),
        };

        try {
            const unsub = auth.onAuthStateChanged((authObj) => {
              unsub();
              if (authObj) {
                const uid = auth.currentUser.uid;
      
                getDoc(doc(firestore, uid, "recipes"))
                  .then((docSnap) => {
                    if (docSnap.exists()) {
                      //const colRef = userId;
                      const ref = doc(firestore, userId, "recipes");
      
                      //get index of unedited recipe
                      const recIndex = newRecipe.id - 1;
      
                      //copy array
                      const newArr = docSnap.data().recipes;
      
                      if (recIndex !== -1) {
                        newArr[recIndex] = newRecipe;
                      }
      
                      updateDoc(ref, {
                        recipes: newArr,
                      });

                    //   setTimeout(() => {
                    //     window.location = `/recipes/${newRecipe.id}`;
                    //   }, 2000);
      
                    //   setTimeout();
                    } else {
                      console.log("No such document!");
                      
                    }
                  })
                  .catch((error) => {
                    console.log("Error getting document:", error);
                    
                  });
              } else {
                console.log("user not logged in");
                
              }
            });
          } catch (err) {
            console.log(err);
          }
    }

    return (
        <main>
            <form id="recipe-form">
                <div className="form-group">
                    <label for="title">Title</label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        ref={recTitle}
                        defaultValue={recipeCard.title}
                        placeholder="e.g Apple Pie"
                        required/>
                </div>

                <div className="form-group">
                    <label for="desc">Description</label>
                    <textarea
                        id="desc"
                        type="text"
                        name="desc"
                        ref={recDesc}
                        defaultValue={recipeCard.description}
                        placeholder="Write a short summary about your recipe"/>
                </div>

                <div className="form-group">
                    <label for="ingredients">Ingredients</label>
                    <div className="button-input">
                        <input
                            id="ingredients"
                            type="text"
                            name="ingredients"
                            ref={recIng}
                            placeholder="e.g Apples, Sugar, etc."
                            required/>   
                        <button type="button" onClick={addIng} className="btn yellow-btn">Add</button> 
                    </div>
                    <div className="button-list">{ingredientButtons}</div>
                </div>

                <div className="form-group">
                    <label for="tags">Tags</label>
                    <div className="button-input">
                        <input
                            id="tags"
                            type="text"
                            name="tags"
                            ref={recTag}
                            //defaultValue={recipeCard.tags}
                            placeholder="e.g Desert, Sweet, etc."/>   
                        <button type="button" onClick={addTag} className="btn yellow-btn">Add</button> 
                    </div>
                    <div className="button-list">{tagButtons}</div>
                </div>

                <div className="form-group">
                    <label for="notes">Notes</label>
                    <textarea
                        id="notes"
                        type="text"
                        name="notes"
                        ref={recNotes}
                        defaultValue={recipeCard.notes}
                        placeholder="Instructions, substitutions, or anyhting you want!"/>
                </div>

                <div className="form-group button-group">
                    <button type="button" onClick={deleteRecipe} className="btn red-btn">Delete</button>
                    <button type="button" onClick={cancelSubmission} className="btn blue-btn">Cancel</button>
                    <button type="submit" onClick={handleSave} className="btn green-btn">Save</button> 
                </div>
            </form>
        </main>
    )
}

export default Edit;