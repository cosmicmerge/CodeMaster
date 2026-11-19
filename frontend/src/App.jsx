import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./authSlice";
import Homepage from "./pages/homePage.jsx";
import Login from "./pages/login.jsx";
import SignUp from "./pages/singUp.jsx";
import AdminPanel from "./pages/adminPanel.jsx"
import "./App.css";



function App() {
  const { isAuthenticated, user,loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-xs text-zinc-400 font-mono">Initializing CodeHub...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" replace /> : <SignUp />}
      />
      <Route path="/admin" element={<AdminPanel/>}></Route>

      {/* <Route
        path="/admin"
        element={
          isAuthenticated  && user?.role==="admin" ?
          (<AdminPanel></AdminPanel>):
          (<Navigate to="/" replace></Navigate>)
        }

      >
      </Route> */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;