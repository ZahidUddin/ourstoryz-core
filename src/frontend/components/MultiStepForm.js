import React, { useState, useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';

function MultiStepForm() {
    const [modalSets, setModalSets] = useState({ set1: [], set2: [] });
    const [selectedSet, setSelectedSet] = useState(null);
    const [currentModalIndex, setCurrentModalIndex] = useState(0);

    // Fetch modal sets from the backend
    useEffect(() => {
        apiFetch({ path: `${ourstoryzCoreSettings.restURL}modal-sets` })
            .then(data => setModalSets(data))
            .catch(error => console.error('Error fetching modal sets:', error));
    }, []);

    // Function to handle selection of a modal set
    const handleSelection = (event) => {
        const selected = event.target.getAttribute('triggerSet');
        setSelectedSet(selected);
        setCurrentModalIndex(0); // Reset to the first modal in the selected set
    };

    // Function to handle "Next" button click
    const handleNext = () => {
        if (selectedSet && currentModalIndex < modalSets[selectedSet].length - 1) {
            setCurrentModalIndex(currentModalIndex + 1);
        } else {
            alert('End of the sequence.');
        }
    };

    // Determine the current modal ID
    const currentModal = selectedSet ? modalSets[selectedSet][currentModalIndex] : null;

    return (
        <div>
            <h2>Select an Option</h2>
            <input type="radio" name="eventName" onChange={handleSelection} triggerSet="set1" /> Set 1
            <input type="radio" name="eventName" onChange={handleSelection} triggerSet="set2" /> Set 2

            <button onClick={handleNext} disabled={!selectedSet}>
                Next
            </button>

            {currentModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setCurrentModalIndex(null)}>&times;</span>
                        <h3>Modal ID: {currentModal}</h3>
                        <p>This is the content for modal {currentModal}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MultiStepForm;
