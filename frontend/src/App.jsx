/* eslint-disable react/react-in-jsx-scope */
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/ui/Header";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import TransactionPage from "./pages/TransactionPage";
import NotFoundPage from "./pages/NotFoundPage";

import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query.js";
import { Toaster } from 'react-hot-toast';

const App = () => {
  const {loading, data, error} = useQuery(GET_AUTHENTICATED_USER);

  console.log("is loading: ", loading);
  console.log("Authenticated user: ", data);
  console.log("is Error: ", error);

  if(loading) return null;
  
  return (
    <>
      {data?.authUser && <Header />}
      <Routes>
        <Route path='/' element={data.authUser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path='/login' element={!data.authUser ? <LoginPage /> : <Navigate to='/' />} />
        <Route path='/signup' element={!data.authUser ? <SignupPage /> : <Navigate to='/' />} />
        <Route 
          path='/transaction/:id' 
          element={data.authUser ? <TransactionPage /> : <Navigate to='/' />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App;