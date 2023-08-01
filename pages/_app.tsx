import type { AppProps } from 'next/app'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../config/firebase';
import Login from '../components/login';
import Loading from '../components/loading';
import { useEffect } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';


export default function App({ Component, pageProps }: AppProps) {

  const [user, loading, error] = useAuthState(auth);

  const setLastseenUserInDb = async (online: boolean) => {
    try {
      await setDoc(
        doc(db, "USERS", user?.uid as string),
        {
          email: user?.email,
          lastSeen: serverTimestamp(),
          photoURL: user?.photoURL,
          online: online
        }
        ,
        { merge: true }
      )
    } catch (error) {
      console.log("error set user in db => ", error);
    }
  }

  useEffect(() => {
    if (user) {
      setLastseenUserInDb(true)
      window.addEventListener('beforeunload', function (e) {
        setLastseenUserInDb(false)
      });
    }
  }, [user])



  if (loading)
    return <Loading />

  if (!user)
    return <Login />

  return <Component {...pageProps} />
}
