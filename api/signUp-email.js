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
                <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <tr>
                            <td align="center" style="background-color: #4CAF50; padding: 20px 0; border-radius: 8px 8px 0 0;">
                                <h1 style="color: #ffffff; margin: 0;">Welcome to Our App!</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px; text-align: left; color: #333333;">
                                <p>Hi ${firstName} ${lastName},</p>
                                <p>We're thrilled to have you join us! Explore the app, and let us know if you have any questions.</p>
                                <p>If you need assistance, feel free to contact our support team anytime.</p>
                                <p>Enjoy your journey with us!</p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 20px; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
                                <p style="font-size: 14px; color: #888888; margin: 0;">
                                    &copy; 2024 Our App. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
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
