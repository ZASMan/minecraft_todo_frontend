import firebase from "firebase/app";
import "firebase/auth";

function SignOutButton() {
  const handleSignOut = () => {
    firebase.auth().signOut();
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}

export default SignOutButton;