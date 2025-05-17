import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import SurveyPage from "./pages/SurveyPage";
import SurveySummary from "./pages/SurveySummary";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/survey/:id" element={<SurveyPage />} />
        <Route path="/survey/:id/summary" element={<SurveySummary />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
