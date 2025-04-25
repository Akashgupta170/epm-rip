import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";
import Login from "./components/pages/Login";
import AppRoutes from "./components/Routes";
// import { ThemeProvider } from "@material-native-ui/theme-provider";

function App() {
  return (
    // <ThemeProvider> {/* Wrap everything inside ThemeProvider */}
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
        </AuthProvider>
      </Router>
    //  </ThemeProvider>
  );
}

export default App;
