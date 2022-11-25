import React, { useRef, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { auth, firestore } from '../../config/Firebase';
import { updateDoc, doc, arrayUnion, getDoc } from 'firebase/firestore';

function Create() {

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
    const [recipeCards, setRecipeCards] = useState([]);

    const navigate = useNavigate();

    //get list of all recipes
    useEffect(() => {
        const unsub = auth.onAuthStateChanged((authObj) => {
            unsub();

            if (authObj) {
                const uid = auth.currentUser.uid;
                setUserId(uid);
                getDoc(doc(firestore, uid, "recipes")).then(docSnap => {
                    if (docSnap.exists()) {
                        setRecipeCards(docSnap.data())
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
                {ing}
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
                {tag}
            </button>
        );
    });

    //cancel submission
    function cancelSubmission() {
        navigate(-1)
    }

    //save new recipe to firestore database
    const handleSave = async (e) => {
        e.preventDefault();

        document.getElementById("button-list").innerHTML = "";

        //create new recipe object to add to the recipe document
        //const newId = recipeCards.recipes.length + 1;
        const newRecipe = {
            id: recipeCards.recipes.length + 1,
            title: recTitle.current.value,
            tags: tagArr,
            description: recDesc.current.value,
            ingredients: ingArr,
            notes: recNotes.current.value
        }

        try {
            //const colRef = user
            const ref = doc(firestore, userId, "recipes")
            updateDoc(
                ref, {
                    recipes: arrayUnion(newRecipe)
                }
            )

            //wait for document to update before reloading
            //set up a loading animation
            setTimeout(() => {
                window.location = `/recipes/${newRecipe.id}`;
            }, 2000)

            setTimeout()
        } catch (error) {
            //replace with a "please try again error message"
            console.log(error)
        }
    }

    return (
        <main>
            <form>
                <div className="form-group">
                    <label for="title">Title</label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        ref={recTitle}
                        placeholder="e.g Apple Pie"
                        required/>
                </div>

                <div className="form-group">
                    <label for="desc">Description</label>
                    <input
                        id="desc"
                        type="text"
                        name="desc"
                        ref={recDesc}
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
                    <div id="button-list">{ingredientButtons}</div>
                </div>

                <div className="form-group">
                    <label for="tags">Tags</label>
                    <div className="button-input">
                        <input
                            id="tags"
                            type="text"
                            name="tags"
                            ref={recTag}
                            placeholder="e.g Desert, Sweet, etc."/>   
                        <button type="button" onClick={addTag} className="btn yellow-btn">Add</button> 
                    </div>
                    <div id="button-list">{tagButtons}</div>
                </div>

                <div className="form-group">
                    <label for="notes">Notes</label>
                    <input
                        id="notes"
                        type="text"
                        name="notes"
                        ref={recNotes}
                        placeholder="Instructions, substitutions, or anyhting you want!"/>
                </div>

                <div className="form-group">
                    <button type="button" onClick={cancelSubmission} className="btn">Cancel</button>
                    <button type="submit" onClick={handleSave} className="btn">Save</button> 
                </div>
            </form>
        </main>
    )
}

export default Create;