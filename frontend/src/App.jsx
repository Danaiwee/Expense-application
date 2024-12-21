/* eslint-disable react/react-in-jsx-scope */
import { Route, Routes } from "react-router-dom";
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
  
  
  return (
    <>
      {data?.authUser && <Header />}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/transaction' element={<TransactionPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App