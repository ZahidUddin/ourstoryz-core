import React, { useState, useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';

function AdminDashboard() {
    const [modalSets, setModalSets] = useState({ set1: [], set2: [] });
    const [newModal, setNewModal] = useState({ set: 'set1', modalId: '' });

    // Fetch existing modal sets from the backend
    useEffect(() => {
        apiFetch({ path: `${ourstoryzCoreSettings.restURL}modal-sets` })
            .then(data => setModalSets(data))
            .catch(error => console.error('Error fetching modal sets:', error));
    }, []);

    // Handle input changes for new modal
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewModal(prev => ({ ...prev, [name]: value }));
    };

    // Add a new modal to the selected set
    const addModal = () => {
        const { set, modalId } = newModal;
        if (modalId) {
            setModalSets(prev => ({
                ...prev,
                [set]: [...prev[set], modalId]
            }));
            setNewModal({ set: 'set1', modalId: '' });
        } else {
            alert("Modal ID is required.");
        }
    };

    // Save modal sets to the backend
    const saveModalSets = () => {
        apiFetch({
            path: `${ourstoryzCoreSettings.restURL}modal-sets`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': ourstoryzCoreSettings.nonce,
            },
            body: JSON.stringify({ sets: modalSets }),
        })
        .then(() => alert('Modal sets saved successfully!'))
        .catch(error => console.error('Error saving modal sets:', error));
    };

    return (
        <div>
            <h1>OurStoryz Core - Manage Modal Sets</h1>
            <div>
                <select name="set" value={newModal.set} onChange={handleChange}>
                    <option value="set1">Set 1</option>
                    <option value="set2">Set 2</option>
                </select>
                <input
                    type="text"
                    name="modalId"
                    placeholder="Modal ID"
                    value={newModal.modalId}
                    onChange={handleChange}
                    style={{ marginRight: '10px' }}
                />
                <button onClick={addModal}>Add Modal to Set</button>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h3>Set 1 Sequence</h3>
                <ul>
                    {modalSets.set1.map((modal, index) => (
                        <li key={index}>Modal ID: {modal}</li>
                    ))}
                </ul>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h3>Set 2 Sequence</h3>
                <ul>
                    {modalSets.set2.map((modal, index) => (
                        <li key={index}>Modal ID: {modal}</li>
                    ))}
                </ul>
            </div>

            <button onClick={saveModalSets} style={{ marginTop: '20px' }}>Save Modal Sets</button>
        </div>
    );
}

export default AdminDashboard;
