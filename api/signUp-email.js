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
        const html_content = `<html>
<body style="font-family: 'Roboto', Arial, sans-serif; background-color: #F9FAFB; margin: 0; padding: 20px;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <!-- Header -->
      <tr>
        <td align="center" style="background-color: #0A0C0F; padding: 20px 0; border-radius: 8px 8px 0 0;">
          <h1 style="font-family: 'Lalezar', Arial, sans-serif; color: #EE703C; margin: 0; font-size: 4rem; text-transform: uppercase;">
            Welcome to Our App!
          </h1>
        </td>
      </tr>

      <tr>
        <td style="padding: 30px; text-align: left; color: #171A1C;">
          <p style="font-family: 'Roboto', Arial, sans-serif; font-size: 1.125rem; margin: 0 0 15px;">
            Hi <span style="color: #0056FF;">${firstName} ${lastName}</span>,
          </p>
          <p style="font-family: 'Inter', Arial, sans-serif; font-size: 1rem; margin: 0 0 15px;">
            We're thrilled to have you join us! Explore the app, and let us know if you have any questions.
          </p>
          <p style="font-family: 'Roboto', Arial, sans-serif; font-size: 1rem; margin: 0 0 15px;">
            If you need assistance, feel free to contact our support team anytime.
          </p>
          <p style="font-family: 'Roboto', Arial, sans-serif; font-size: 1rem; margin: 0;">
            Enjoy your journey with us!
          </p>
        </td>
      </tr>

      <tr>
        <td align="center" style="padding: 20px; background-color: #F2F0EB; border-radius: 0 0 8px 8px;">
          <p style="font-family: 'Roboto', Arial, sans-serif; font-size: 0.875rem; color: #888888; margin: 0;">
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
