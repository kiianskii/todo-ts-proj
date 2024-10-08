import React, { Suspense, useEffect } from "react";

import "./App.css";

import RegisterPage from "./components/RegisterPage/RegisterPage";
import LoginPage from "./components/LoginPage/LoginPage";
import { Route, Routes } from "react-router-dom";
import Loader from "./components/Loader/Loader";
import { useSelector } from "react-redux";
import { selectIsLoggedIn, selectIsRefreshing } from "./redux/auth/slice";
import { AppDispatch } from "./redux/store";
import { useDispatch } from "react-redux";
import { refreshThunk } from "./redux/auth/operations";
import { RestrictedRoute } from "./routes/RestrictedRoute";
import { PrivateRoute } from "./routes/PrivateRoute";
import TodoPage from "./pages/TodoPage/TodoPage";
import Layout from "./pages/Layout/Layout";
import { fetchTodosThunk } from "./redux/todo/operations";
import { Toaster } from "react-hot-toast";

function App() {
  const isRefreshing = useSelector(selectIsRefreshing);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(refreshThunk());
    if (isLoggedIn) {
      dispatch(fetchTodosThunk());
    }
  }, [dispatch, isLoggedIn]);

  return isRefreshing ? (
    <Loader />
  ) : (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            path="/"
            element={<PrivateRoute redirectTo="/login" component={TodoPage} />}
          />

          <Route
            path="/login"
            element={<RestrictedRoute redirectTo="/" component={LoginPage} />}
          />
          <Route
            path="/register"
            element={
              <RestrictedRoute redirectTo="/" component={RegisterPage} />
            }
          />
        </Route>
      </Routes>
      <Toaster />
    </Suspense>
  );
}

export default App;
