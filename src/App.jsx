import { Routes, Route } from "react-router-dom";

import Logins from "./pages/login.jsx";
import Homepage from "./pages/homepage.jsx";
import File from "./components/file.jsx";
import Result from "./pages/result.jsx";
import Spelling from "./pages/spelling.jsx";
import Grammar from "./pages/grammar.jsx";
import SpellingResult from "./components/spellingresult.jsx";
import GrammarResult from "./components/grammarresult.jsx";
import Grading from "./pages/grading.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Logins />} />
      <Route path="/home" element={<Homepage />} />
      <Route path="/file" element={<File />} />
      <Route path="/spelling" element={<Spelling />} />
      <Route path="/spellingresult" element={<SpellingResult />} />
      <Route path="/grammar" element={<Grammar />} />
      <Route path="/grammar-result" element={<GrammarResult />} />
      <Route path="/reports" element={<Result />} />
      <Route path="/result" element={<Result />} />
      <Route path="/grading" element={<Grading />} />
    </Routes>
  );
}

export default App;