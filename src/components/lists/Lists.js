import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { auth, firestore } from '../../config/Firebase';
import { doc, getDoc } from 'firebase/firestore';

function Lists() {
    const [myLists, setMyLists] = useState([]);

    //get array of all lists in the shoppingLists document
    useEffect(() => {
        const unsub = auth.onAuthStateChanged((authObj) => {
            unsub();

            if (authObj) {
                const uid = auth.currentUser.uid;

                getDoc(doc(firestore, uid, "shopping lists")).then(docSnap => {
                    if (docSnap.exists()) {
                        setMyLists(docSnap.data().lists);
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
    let reversedLists = myLists;
    let listGallery = [...reversedLists].reverse();

    //map over each recipe to render a recipe card
    const listCards = listGallery.map((list) => {

        // const items = list.items.map((item) => {

        //     return (  
        //         <li key={item.item} className="item">
        //             <p>{item.item}</p>
        //             <p>{item.portions}</p>
        //         </li>
        //     );
        // })

        return (
            <div className="list" key={list.id}>
                <span>{list.date}</span>
                <h4>{list.title}</h4>
                <span>{list.items.length} items</span>
                <a href="#">View</a>
            </div>
        );
    });

    //render lists
    return (
        <section id="my-shopping-lists">
            {listCards}
        </section>
    )
}

export default Lists;