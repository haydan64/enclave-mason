const express = require("express");
const axios = require("axios");
const { Socket } = require("socket.io");
const app = express();
const port = 3000;

// Your Discord client ID and secret
const clientId = "1267384889620303913";
const clientSecret = "YOUR_CLIENT_SECRET";
const redirectUri = "https://discord.com/oauth2/authorize?client_id=1267384889620303913&response_type=code&redirect_uri=https%3A%2F%2Fkingdoms.cloudcue.net%2Fdashboard.html&scope=identify";

// Route to handle OAuth2 callback
app.get("/auth/discord", async (req, res) => {
	const code = req.query.code;

	try {
		// Exchange authorization code for access token
		const response = await axios.post("https://discord.com/api/oauth2/token", null, {
			params: {
				client_id: clientId,
				client_secret: clientSecret,
				grant_type: "authorization_code",
				code: code,
				redirect_uri: redirectUri,
			},
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		const accessToken = response.data.access_token;

		// Redirect to a valid page after successful authentication
		res.redirect("/dashboard.html");
	} catch (error) {
		console.error("Error exchanging code for token:", error);
		res.redirect("/error.html");
	}
});

// Example route for the dashboard
app.get("/dashboard.html", (req, res) => {
	res.send("Welcome to your dashboard!");
});

// Example route for error handling
app.get("/error.html", (req, res) => {
	res.send("An error occurred during authentication.");
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});

