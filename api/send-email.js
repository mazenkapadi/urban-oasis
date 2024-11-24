import fetch from 'node-fetch';

export async function POST(req) {
    const reqBody = await req.json();
    const {recipient, subject, html_content} = reqBody;

    const response = await fetch(
        // import.meta
        process.env.VITE_EMAIL_ENDPOINT_URL,
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({recipient, subject, html_content}),
        }
    );

    if (!response.ok) {
        return new Response('Error sending email', {
            status: 500
        });
    }

    return new Response('Email sent successfully', {
        status: 200
    });

}