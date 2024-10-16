import React, { useEffect, useState } from 'react';
import apiFetch from '@wordpress/api-fetch';

function AdminPanel() {
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        apiFetch({ path: `${ourstoryzCoreSettings.restURL}submissions` })
            .then(setSubmissions)
            .catch(error => console.error('Error fetching submissions:', error));
    }, []);

    return (
        <div>
            <h1>Form Submissions</h1>
            {submissions.length ? (
                <ul>
                    {submissions.map((submission, index) => (
                        <li key={index}>{JSON.stringify(submission)}</li>
                    ))}
                </ul>
            ) : (
                <p>No submissions yet.</p>
            )}
        </div>
    );
}

export default AdminPanel;
