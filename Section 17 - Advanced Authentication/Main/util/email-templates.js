const emailTemplates = {
	confirmationMail: `
        <main style="text-align: center">
            <h2 style="color: blue; margin-bottom: 15px;">You have successfully signed up to the shop!</h2>
            <p style="color: dodgerblue;">Welcome to the Node-shop, this is just an email template that is designed to demonstrate the email compose and send functionality.</p>
            <a href="http://localhost:3000/" style="text-decoration: none;">Click to be back at the app</a>
        </main>
    `,
	passwordResetMail(token) {
		return `
        <main style="text-align: center">
            <h2 style="color: blue; margin-bottom: 15px;">Please reset your password here</h2>
            <p style="color: dodgerblue;">Your password reset link is available below, please click on it to navigate to the password reset page and create a new password.</p>
            <a href="http://localhost:3000/new-password/${token}" style="text-decoration: none;">To the password reset</a>
        </main>
    `;
	},
	passwordResetSuccess: `
        <main style="text-align: center">
            <h2 style="color: blue; margin-bottom: 15px;">Your password has been reset successfully</h2>
            <p style="color: dodgerblue;">Your password has been reset to a new password as requested. Feel free to login with the new password.</p>
        </main>
    `,
};

module.exports = emailTemplates;
