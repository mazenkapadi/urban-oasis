import { useState, useEffect } from 'react';

// FIXME: This is a test that may never work. This is a dev util for fetching deployment logs from Vercel.
// FIXME: Learn how to use console.log() to debug the code in the browser console.

const DevTools = () => {
    const [deployments, setDeployments] = useState([]);
    const [selectedDeployment, setSelectedDeployment] = useState(null);
    const [buildLogs, setBuildLogs] = useState('');

    useEffect(() => {
        const fetchDeployments = async () => {
            try {
                // Replace with your actual Vercel project ID and API token
                const response = await fetch(`https://api.vercel.com/v6/deployments?teamId=<YOUR_TEAM_ID>`, {
                    headers: {
                        Authorization: `Bearer <YOUR_VERCEL_API_TOKEN>`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch deployments');
                }

                const data = await response.json();
                setDeployments(data.deployments);
            } catch (error) {
                console.error('Error fetching deployments:', error);
                // Handle error gracefully (e.g., display an error message to the user)
            }
        };

        fetchDeployments();
    }, []);

    // Fetch build logs when a deployment is selected
    useEffect(() => {
        const fetchBuildLogs = async () => {
            if (!selectedDeployment) return;

            try {
                // Replace with the actual endpoint to fetch build logs for a specific deployment
                const response = await fetch(`https://api.vercel.com/v1/deployments/${selectedDeployment.id}/builds`, {
                    headers: {
                        Authorization: `Bearer <YOUR_VERCEL_API_TOKEN>`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch build logs');
                }

                const data = await response.json();
                // Assuming the build logs are in a field like 'logs' in the response
                setBuildLogs(data.builds[0].logs);
            } catch (error) {
                console.error('Error fetching build logs:', error);
                // Handle error gracefully
            }
        };

        fetchBuildLogs();
    }, [selectedDeployment]);

    return (
        <div>
            <h1>Deployment Logs</h1>

            {/* List of deployments */}
            <ul>
                {deployments.map((deployment) => (
                    <li key={deployment.id} onClick={() => setSelectedDeployment(deployment)}>
                        {deployment.url} - {deployment.createdAt}
                    </li>
                ))}
            </ul>

            {/* Display build logs for the selected deployment */}
            {selectedDeployment && (
                <div>
                    <h2>Build Logs for {selectedDeployment.url}</h2>
                    <pre>{buildLogs}</pre>
                </div>
            )}
        </div>
    );
};

export default DevTools;