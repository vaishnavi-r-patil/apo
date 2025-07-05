// App.js
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CatScene from "./components/CatScene";
import RipScene from "./components/RipScene";
import HomePage from "./components/HomePage";
import CityInput from "./components/CityInput";
import Result from "./components/Result";

function App() {
  const [step, setStep] = useState(0);
  const [resultData, setResultData] = useState(null);

  const handleCatSceneComplete = () => setStep(1);
  const handleRipSceneComplete = () => setStep(2);

  const handleCitySubmit = (data) => {
    setResultData(data);
    setStep(3); // Show Result page
  };

  const handleBack = () => {
    setResultData(null);
    setStep(2); // Go back to CityInput
  };

  return (
    <Routes>
      {step === 0 && (
        <Route path="*" element={<CatScene onComplete={handleCatSceneComplete} />} />
      )}
      {step === 1 && (
        <Route path="*" element={<RipScene onComplete={handleRipSceneComplete} />} />
      )}
      {step === 2 && (
        <>
          <Route path="/" element={<HomePage />} />
          <Route path="/city" element={<CityInput onSubmit={handleCitySubmit} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
      {step === 3 && resultData && (
        <Route path="*" element={<Result data={resultData} onBack={handleBack} />} />
      )}
    </Routes>
  );
}

export default App;
