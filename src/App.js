import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CitiesTable from "./components/CitiesTable";
import WeatherPage from "./components/WeatherPage";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/weather/:city" element={<WeatherPage />} />
          <Route path="/" element={<CitiesTable />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
