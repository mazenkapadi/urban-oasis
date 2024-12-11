import QRCode from 'qrcode';
import fetch from 'node-fetch';

export async function POST(req) {
    try {
        const reqBody = await req.json();
        const {userId, eventId, email, quantity, eventTitle, eventDateTime} = reqBody;

        if (!userId || !eventId || !email || !quantity || !eventTitle || !eventDateTime) {
            return new Response('Missing required fields', {status: 400});
        }

        const rsvpUrl = `${process.env.VITE_BASE_URL}/rsvp/validate?userId=${encodeURIComponent(userId)}&eventId=${encodeURIComponent(eventId)}&quantity=${encodeURIComponent(quantity)}&eventTitle=${encodeURIComponent(eventTitle)}`;

        const qrCodeDataURL = await QRCode.toDataURL(rsvpUrl);

        const subject = `Your RSVP for ${eventTitle}`;
        const html_content = `
            <html lang="en">
                <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
                    <h1>Your RSVP Details</h1>
                    <p><strong>Event:</strong> ${eventTitle}</p>
                    <p><strong>Date & Time:</strong> ${eventDateTime}</p>
                    <p><strong>Quantity:</strong> ${quantity}</p>
                    <p>Below is your QR code:</p>
                    <img src="${qrCodeDataURL}" alt="QR Code" style="width: 200px; height: 200px;">
                    <p>Scan this code to view your RSVP details or show it at the event for validation.</p>
                </body>
            </html>
        `;

        const response = await fetch(process.env.VITE_EMAIL_ENDPOINT_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({recipient: email, subject, html_content}),
        });

        if (!response.ok) {
            return new Response('Error sending email', {status: 500});
        }

        return new Response('QR code email sent successfully', {status: 200});
    } catch (error) {
        console.error(error);
        return new Response('Internal server error', {status: 500});
    }
}
