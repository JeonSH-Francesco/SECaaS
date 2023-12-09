import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { routes } from "./routes";
import SignIn from "./pages/auth/SignIn";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect to the desired initial route ("/customers") */}
        <Route
          path="/"
          element={<Navigate to="/users/signin" />}
        />

        {/* Define your routes */}
        {routes}

        {/* Fallback route for unknown paths */}
        <Route path="*" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;