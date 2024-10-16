import React, { useState } from 'react';
import OptionModal from './OptionModal';

function MultiStepForm() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [showModal, setShowModal] = useState(null);

    const handleNextStep = (selectedOption, inputData) => {
        setFormData(prevData => ({ ...prevData, ...inputData }));
        setCurrentStep(currentStep + 1);
        setShowModal(selectedOption); 
    };

    const handleSubmit = () => {
        fetch(`${ourstoryzCoreSettings.restURL}submissions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': ourstoryzCoreSettings.nonce },
            body: JSON.stringify(formData)
        }).then(response => response.json())
          .then(() => alert("Submission saved!"));
    };

    return (
        <div>
            <div className='text-3xl bg-red-900'>Let's Get Started</div>
            {currentStep === 0 && (
                <>
                    <input type="radio" name="event" onClick={() => handleNextStep('set1', { role: 'self' })} /> I am creating the event myself<br/>
                    <input type="radio" name="event" onClick={() => handleNextStep('set2', { role: 'professional' })} /> I am a Professional Event planner or organizer<br/>
                    <button onClick={() => setShowModal(true)}>Next</button>
                </>
            )}
            {showModal && (
                <OptionModal setCurrentStep={setCurrentStep} currentStep={currentStep} formData={formData} handleNextStep={handleNextStep} handleSubmit={handleSubmit} />
            )}
        </div>
    );
}

export default MultiStepForm;
