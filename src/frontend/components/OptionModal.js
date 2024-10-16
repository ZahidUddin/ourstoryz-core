import React, { useState } from 'react';

function OptionModal({ setCurrentStep, currentStep, formData, handleNextStep, handleSubmit }) {
    const [inputs, setInputs] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const goNext = () => {
        if (currentStep < 2) {
            handleNextStep(null, inputs); // assuming each choice goes to different modal
        } else {
            handleSubmit();
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <input name="someInput" placeholder="Type here" onChange={handleInputChange} /><br/>
                <button onClick={() => setCurrentStep(currentStep - 1)}>Back</button>
                <button onClick={goNext}>Next</button>
            </div>
        </div>
    );
}

export default OptionModal;
