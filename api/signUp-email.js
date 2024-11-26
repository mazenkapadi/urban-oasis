import fetch from 'node-fetch';

export async function POST(req) {
    try {
        const reqBody = await req.json();
        const {firstName, lastName, email} = reqBody;

        if (!firstName || !lastName || !email) {
            return new Response('Missing required fields: firstName, lastName, or email', {
                status: 400,
            });
        }

        // Generate the email content
        const subject = `Welcome to Our App, ${firstName} ${lastName}!`;
        const html_content = `
<html>
    <body style="font-family: 'Roboto', sans-serif; background-color: #F9FAFB; margin: 0; padding: 20px; text-align: center;">
        <div style="background-color: #0A0C0F; padding: 20px;">
            <h1 style="color: #F9FAFB; font-family: 'Lalezar', sans-serif; font-size: 2.5rem; margin: 0;">
                Welcome to Urban Oasis!
            </h1>
        </div>

        <div style="padding: 20px; color: #333333; font-size: 1rem; line-height: 1.8;">
            <p style="margin-top: 0;">Hi ${firstName} ${lastName},</p>
            <p>
                Welcome to <span style="color: #EE703C; font-weight: bold;">Urban Oasis</span>, where new opportunities and experiences await you! We’re thrilled to have you join our community.
            </p>
            <p>Here’s how to make the most of your journey with us:</p>
            <ul style="list-style: none; padding: 0; text-align: left; display: inline-block; color: #171717; line-height: 1.6;">
                <li>• Discover and explore exclusive events, meetups, and activities.</li>
                <li>• Connect with others who share your passions and interests.</li>
                <li>• Save your favorites and personalize your experience.</li>
            </ul>
            <p style="color: #171A1C;">Need help? Our support team is here for you. Feel free to reach out anytime for assistance.</p>
        </div>

        <div style="padding: 20px;">
            <a href="https://urban-oasis490.vercel.app" target="_blank" style="text-decoration: none;">
                <button style="background-color: #0056FF; color: #FFFFFF; padding: 12px 24px; font-size: 1.125rem; font-weight: bold; border: none; border-radius: 6px; cursor: pointer;">
                    Get Started
                </button>
            </a>
        </div>

        <div style="background-color: #F2F0EB; padding: 20px; font-size: 0.875rem; color: #888888;">
            <p style="margin: 0;">Thank you for choosing <span style="color: #EE703C; font-weight: bold;">Urban Oasis</span>.</p>
            <p style="margin: 0;">© 2024 Urban Oasis. All rights reserved.</p>
        </div>
    </body>
</html>

        `;

        const response = await fetch(
            "https://urban-oasis490.vercel.app/api/send-email",
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({recipient: email, subject, html_content}),
            }
        );

        if (!response.ok) {
            return new Response('Error sending email', {
                status: 500
            });
        }

    } catch (error) {
        console.error(error);
        return new Response('Internal server error', {
            status: 500,
        });
    }
}
