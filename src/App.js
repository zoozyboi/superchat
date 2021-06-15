import React from 'react';
import {useState } from 'react'; 
import {useRef } from 'react'; 
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { div } from 'prelude-ls';

firebase.initializeApp({
  apiKey: "AIzaSyChZGne87r6umIM71CGqFaEt33Bu69jcCo",
  authDomain: "simple-chatroom-2f43e.firebaseapp.com",
  projectId: "simple-chatroom-2f43e",
  storageBucket: "simple-chatroom-2f43e.appspot.com",
  messagingSenderId: "738274598003",
  appId: "1:738274598003:web:d25394adf7c1fc72d81e06",
  measurementId: "G-FMN4E7PQHQ"
})
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const[user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <a href="http://localhost:3001/">💬</a>
      
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom />: <SignIn />}
      </section>
    </div>
  );
}
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <button onClick={signInWithGoogle}>Sign in with Google </button>
  )
}
function SignOut() {
  return auth.currentUser && (
    <>
    <button onClick={() => auth.signOut()}>Sign Out</button>
    </>
  )
}


function ChatRoom() {
  const dummy = useRef();
 const messageRef = firestore.collection('message');
 const query = messageRef.orderBy('createdAt').limit(25);
 const [messages]  = useCollectionData(query, {idField: 'id'});

 const [formValue, setFormValue] = useState('');
 const sendMessage = async(e) => {
   e.preventDefault();
   const { uid, photoURL } = auth.currentUser;
   
   await messageRef.add({
    text: formValue,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    uid,
    photoURL
   }); 
   setFormValue('');

   dummy.current.scrollIntoView({ behavior: 'smooth'});
 }
 return (
   <>
   <main>
   {messages && messages.map(msg => <ChatMessage key ={msg.id} message={msg} />)}
   <div ref={dummy}></div>
   </main>

 
    <form onSubmit={sendMessage}>

    <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
    <button type="submit">SEND</button>
  
    </form>
    </>

 )
}
function ChatMessage(props) {
  const { text, uid, photoURL,createdAt } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return(
    <div className={'message ${messagesClass}'}>
    <img src={photoURL}/>
    <p>{text}</p>
    
  </div>
  )
}

export default App;
