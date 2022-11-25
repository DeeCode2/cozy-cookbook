import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../config/AuthContext';
import { auth } from "../../config/Firebase.js";
import { doc, setDoc, getFirestore } from "firebase/firestore";


const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')

    const { createUser } = UserAuth();
    const navigate = useNavigate()

    //create a new user and a corresponding profile
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      try {
        await createUser(email, password);
        const userUid = auth.currentUser.uid;
        const db = getFirestore();
        console.log(userUid)

        const docRef = await setDoc(doc(db, userUid, "recipes"), {
            recipes: []
          });

        const listRef = await setDoc(doc(db, userUid, "shopping lists"), {
        shoppingList: []
        });
          console.log("Shopping list doc created ");

        const menuRef = await setDoc(doc(db, userUid, "menus"), {
        menu: []
        });
            console.log("Menu doc created ");
        
        navigate('/recipes')
        } catch (e) {
        setError(e.message);
        console.log(e.message);
      }
    };

    return (
      <main id="sign-up" className="reg-form">
          <form onSubmit={handleSubmit}>
          <h1>Create your account</h1>

            <div className="form-group">
              <label for="email">Email Address</label><br/>
              <input onChange={(e) => setEmail(e.target.value)}type='email' id="email"/>
            </div>

            <div className="form-group">
              <label for="password">Password</label><br/>
              <input onChange={(e) => setPassword(e.target.value)} type='password' id="password"/>
            </div>

            <button>Sign Up</button>

            <p>Already have an account?{' '}<Link to='/'>Sign in.</Link></p>

          </form>
      </main>
    );
  };
  

export default SignUp;