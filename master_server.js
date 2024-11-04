const fs = require("fs");
const path = require("path");
const { spawn, execSync } = require("child_process");
const http = require("http");
const https = require("https");
const url = require('url');
const { Server } = require('socket.io');
let config = require("./master-config.json");
const chalk = require('chalk');
const serverProperties = {};
const DB = require("./master-deps/master-db.js");
const xeronParts = require("./master-deps/xeronParts.js");
const env = Object.create(process.env);
const { Client,WebhookClient, Collection, Events, GatewayIntentBits } = require('discord.js');

const DiscordOAuth = {
    clientID: config["discord-oath-client-id"],
    clientSecret: config["discord-oath-client-secret"],
    basicAuth: null
}

DiscordOAuth.basicAuth = `Basic ${Buffer.from(`${DiscordOAuth.clientID}:${DiscordOAuth.clientSecret}`).toString('base64')}`;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'discord/commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


const eventsPath = path.join(__dirname, 'discord/events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}




// Log in to Discord with your client's token
client.login(config["discord-token"]);


const webhookClient = new WebhookClient({ url: 'https://discord.com/api/webhooks/1290563552167329812/G21V4v3S1u053O1iuwWyTJO_VwfYmbou1yNE2SmyIuco5PQ0hWG659-OEuzwQaCIDWtu' });

async function sendCustomMessageWithGuildNickname(guildId, userId, messageContent, backupName) {
    try {
        // Fetch the guild and the member from the guild
        let guild, member;
        try{
            guild = await client.guilds.fetch(guildId);
            member = await guild.members.fetch(userId);
        } catch(e) {
            
        }

        // Get the member's display name (nickname or username)
        const displayName = member?.displayName || backupName;
        
        // Get the user's avatar URL
        const avatarUrl = member?.user?.displayAvatarURL() || undefined;

        // Send a message with the member's display name and avatar
        await webhookClient.send({
            content: messageContent,
            username: displayName,  // Use the member's display name (nickname)
            avatarURL: avatarUrl,    // Use the user's avatar URL
        });

        console.log('Message sent successfully');
    } catch (error) {
        console.error('Error sending message: ', error);
    }
}

// setTimeout(()=>{
//     sendCustomMessageWithGuildNickname(
//         '749358542145716275', // Replace with the guild ID
//         '550912080627236874',  // Replace with the Discord user ID
//         'ok. wow mason server looks insane!!' // Message content
//     );
// },3000)

// Block to grab server properties from server.properties file
grabServerProperties: {
    let about = [];
    let property = null;
    let blank = false;
    fs.readFileSync("./BDS/server.properties").toString().split("\n").forEach((setting) => {
        setting = setting.trim()
        if (setting.startsWith("#")) {
            if (setting.includes("=") && blank === true) {
                if (property) property.about = about.join("\n");
                setting = setting.slice(1).split("=");
                property = serverProperties[setting.shift().trim()] = {
                    value: setting.join("=").trim(),
                    enabled: false,
                    about: null
                }
                about = [];
                blank = false;
                return;
            }
            blank = false;
            about.push(setting);
        } else if (setting.includes("=")) {
            if (property) property.about = about.join("\n");
            setting = setting.split("=");
            property = serverProperties[setting.shift().trim()] = {
                value: setting.join("=").trim(),
                enabled: true,
                about: null
            }
            blank = false;
            about = [];
        } else {
            blank = true;
        }
    });
}

//if the bdsStatus is offline, but the bdsCall is online, server will be restarted.
let bdsCallStatus = "online";// online/offline
let bdsStatus = "offline";// offline/shutting_down/online/starting
let takingBackup = "idle";
let mc = null;
const tokenCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
function generateToken(length) {
    let token = "";
    for (let i = 0; i <= length; i++) {
        token += tokenCharacters[Math.floor(Math.random() * tokenCharacters.length)];
    }
    return token;
}

let worldLocation = `./BDS/worlds/${serverProperties["level-name"].value}`;
let logLocation = `${worldLocation}/master-logs`;
let lastLog = null;
let logStream = null;
function mLog(event, message) {
    const now = (new Date());
    const today = now.toISOString().split("T")[0];
    if (lastLog !== today) {
        if (logStream) logStream.end();
        logStream = fs.createWriteStream(`${logLocation}/${today}.log`, { flags: 'a' });
        lastLog = today;
    }
    logStream.write(`${now.toISOString()}|${event}> ${message}\n`, (err) => {
        if (err) {
            console.error(chalk.bgRedBright.black("ERROR WRITING LOG. ", err))
        }
    })
}

/**
 * @type {{username: {username: String, xuid: string}}}
 */
let players = {};
let weather = "clear";

if (config["auto-start-bds"]) startBedrockDedicatedServer();
function startBedrockDedicatedServer() {
    players = [];
    bdsStatus = "starting";
    if (config.OS === "Ubuntu") {
        env.LD_LIBRARY_PATH = '.';
        mc = spawn("./bedrock_server", { env, cwd: './BDS' });
    } else if (config.OS === "Windows") {
        mc = spawn('./BDS/bedrock_server.exe');
    } else {
        throw new Error("Invalid OS specified in the config. Accepeted values are Windows and Ubuntu");
    }
    mc.stdout.on("data", async (message) => {
        let showMessage = true;
        message = message.toString();
        if (!message.includes("]")) {
            if (!(message.trim().length > 0)) {
                console.log("WTF: MC: WTF: ", message);
            }
        }
        message = message.slice(message.indexOf("]") + 1).trim();
        if (message.startsWith("Data saved. Files are now ready to be copied.")) {//Backup is ready.
            takingBackup = "copying";
            console.log(chalk.bgWhite.black("Backup is downloading..."));
            const files = message.slice("Data saved. Files are now ready to be copied.".length).trim().split(", ")
                .map((value) => {
                    return value.split(":")[0].trim();
                });
            copyBackup(files);

        } else {
            message.split("\n").forEach(async (message) => {

                if (message.startsWith("Player Spawned: ")) {
                    const msg = message.slice("Player Spawned: ".length);
                    const username = msg.slice(0, msg.indexOf("xuid:")).trim();
                    const xuid = msg.slice(msg.indexOf("xuid:") + 5).split(",")[0].trim();
                    console.log(`Player ${username} connected with ID ${xuid}`);
                    mLog("Player connected", `${username}, ${xuid}`);
                    

                    if (!players[username]) {
                        players[username] = {
                            username, xuid
                        }
                    }
                } else if (message.startsWith("Player disconnected: ")) {
                    const msg = message.slice("Player disconnected: ".length);
                    const [username, xuid] = msg.split(", xuid: ").map((value) => { return value.trim() });
                    console.log(`Player ${username} Disconnected with ID ${xuid}`);
                    mLog("Player disconnected", `${username}, ${xuid}`);
                    delete players[username];
                } else if (message.startsWith("[Scripting] [Player Message] ")) {
                    const msg = message.slice("[Scripting] [Player Message] ".length);
                    showMessage = true;
                    try {
                        const m = JSON.parse(msg);
                        mLog("Player Msg", msg);
                        sendCustomMessageWithGuildNickname(config["discord-guildId"], players[m.name]?.xuid, m.message, m.name)
                        io.in("authed").emit("Player Message", {

                        });
                    }
                    catch (e) {
                        console.error(chalk.bgRedBright.black("Player Spawned JSON Malformed. ", e));
                    };
                } else if (message.startsWith("[Scripting] [Player Spawned] ")) {
                    const msg = message.slice("[Scripting] [Player Spawned] ".length);
                    try {
                        const p = JSON.parse(msg);
                        if (p.username) {
                            mLog("Player Spawned", `name:${p.username};loc:${p.location.join(",")};dim:${p.dimension.split(":")[1]};gm:${p.gamemode};tags:${p.tags.join(",")}`);
                            const player = players[p.username];
                            player.location = p.location;
                            player.gamemode = p.gamemode;
                            player.tags = p.tags;
                        }
                        io.in("authed").emit("Player Spawned", players[p.username]);
                    }
                    catch (e) {
                        console.error(chalk.bgRedBright.black("Player Spawned JSON Malformed. ", e));
                    };
                } else if (message.startsWith("[Scripting] [Players Update] ")) {
                    const msg = message.slice("[Scripting] [Players Update] ".length);
                    showMessage = false;
                    try {
                        const ps = JSON.parse(msg);

                        ps.forEach((p) => {
                            if (p.username) {
                                const player = players[p.username];
                                player.location = p.location;
                                player.gamemode = p.gamemode;
                                player.tags = p.tags;
                            }
                        });
                        io.in("authed").emit("Players Update", ps);
                    }
                    catch (e) {
                        console.error(chalk.bgRedBright.black("Player Spawned JSON Malformed. ", e))
                    };
                } else if (message.startsWith("[Scripting] [Player Gamemode Change] ")) {
                    const msg = message.slice("[Scripting] [Player Gamemode Change] ".length);
                    try {
                        const d = JSON.parse(msg);
                        mLog("Player Gamemode Change", msg);
                        if (d.player) {
                            const player = players[d.player];
                            if (player) {
                                player.gamemode = d.gamemode;
                            }
                            io.in("authed").emit("Player Gamemode Change", d);
                        }
                    }
                    catch (e) {
                        console.error(chalk.bgRedBright.black("Player Change Gamemode JSON Malformed. ", e))
                    };
                } else if (message.startsWith("[Scripting] [Player Place] ")) {
                    const msg = message.slice("[Scripting] [Player Place] ".length);
                    showMessage = false;
                    try {
                        const d = JSON.parse(msg)
                        mLog("Player Place", `player:${d.player};loc:${d.location.join(",")};dim:${d.dimension.split(":")[1]};blk:${d.block}`);
                        io.in("authed").emit("Player Place", d);
                    }
                    catch (e) {
                        console.error(chalk.bgRedBright.black("Player Place Block JSON Malformed. ", e))
                    };
                } else if (message.startsWith("[Scripting] [Player Break] ")) {
                    const msg = message.slice("[Scripting] [Player Break] ".length);
                    showMessage = false;
                    try {
                        const d = JSON.parse(msg);
                        mLog("Player Break", `player:${d.player};loc:${d.location.join(",")};dim:${d.dimension.split(":")[1]};blk:${d.block}`);
                        io.in("authed").emit("Player Break", d);
                    }
                    catch (e) {
                        console.error(chalk.bgRedBright.black("Player Break Block JSON Malformed. ", e))
                    };
                } else if (message.startsWith("[Scripting] [Death] ")) {
                    const msg = message.slice("[Scripting] [Death] ".length);
                    try {
                        const d = JSON.parse(msg);
                        mLog("Death", `id:${d.dead};name:${d.deadName};loc:${d.location.join(",")};dim:${d.dimension.split(":")[1]};cause:${d.cause};klr:${d.killer};klrname:${d.killername}`);
                        io.in("authed").emit("Death", d);
                    }
                    catch (e) {
                        console.error(chalk.bgRedBright.black("Death JSON Malformed. ", e))
                    };
                } else if (message.startsWith("[Scripting] [Weather] ")) {
                    const msg = message.slice("[Scripting] [Weather] ".length);
                    mLog("Weather", msg);
                    io.in("authed").emit("Weather", msg);
                } else if (message.startsWith("[Scripting] [Run] ")) {
                    const msg = message.slice("[Scripting] [Run] ".length);
                    mLog("Run", msg);
                    runCommand(msg);
                } else if (message.startsWith("Running AutoCompaction...")) {
                    showMessage = false;
                } else if (message.startsWith("Server started.")) {
                    players = {};

                    bdsStatus = "online";
                    worldLocation = `./BDS/worlds/${serverProperties["level-name"].value}`;
                    logLocation = `${worldLocation}/master-logs`;
                    lastLog = null;
                    mLog("BDS Started.");
                    console.log(chalk.bgWhite.green("BDS Started."));
                    startBackups();
                } else {
                    if (message.trim().length > 0) {
                        mLog("MC", message);
                    }
                }
                if (message.trim().length > 0 & showMessage) console.log(`MC: ${message}`);
            });
        }
    });

    mc.stderr.on("data", message => {
        console.log(`stderr: ${message}`);
    });
    mc.on('error', (error) => {
        console.log(`error: ${error.message}`, error);
    });
    mc.on("close", code => {
        console.log(`Minecraft Bedrock Dedicated Server exited with code ${code}`);
        bdsStatus = "offline";
        if (bdsCallStatus === "online") {
            io.in("authed").emit("BDSrestarting");
            startBedrockDedicatedServer();
        }
        else io.in("authed").emit("BDSstopped");
    });
}

function stopBedrockDedicatedServer() {
    runCommand("stop");
    bdsStatus = "shutting_down";
}

function ceaseBedrockDedicatedServer() {
    bdsCallStatus = "offline";
    stopBedrockDedicatedServer();
}

function numberOfPlayersChanged() {
    io.in("authed").emit("players", players)
}

let stdinFollowUp = null;
let stdinFollowUpData = {};

process.stdin.on("data", (data) => {
    if (stdinFollowUp) {
        if (data.toString().trim() === "cancel") {
            stdinFollowUp = null;
        }
        switch (stdinFollowUp) {
            case ("createUser"): {
                const username = stdinFollowUpData.username;
                stdinFollowUpData.username = undefined;
                const password = data.toString().trim();

                createUser(username, password);
                stdinFollowUp = null;
                break;
            }
            case ("changePassword"): {
                const username = stdinFollowUpData.username;
                stdinFollowUpData.username = undefined;
                const password = data.toString().trim();

                setPasswordUser(username, password);
                stdinFollowUp = null;
                break;
            }
        }
    } else {
        switch (data.toString().split(" ")[0].trim()) {
            case ("reloadConfig"): {
                reloadConfig();
                break;
            }
            case ("backup"): {
                if (takingBackup === "idle") {
                    startBackup()
                } else {
                    console.log(chalk.bgWhiteBright.black("A backup is currently being created."));
                }
                break;
            }
            case ("createUser"): {
                const username = data.toString().split(" ")[1].trim();
                stdinFollowUpData.username = username;
                stdinFollowUp = "createUser";
                console.log(chalk.bgWhiteBright.black("Please enter a password, or type 'cancel' to cancel."))
                break;
            }
            case ("changePassword"): {
                const username = data.toString().split(" ")[1].trim();
                stdinFollowUpData.username = username;
                stdinFollowUp = "changePassword";
                console.log(chalk.bgWhiteBright.black("Please enter a new password, or type 'cancel' to cancel."))
                break;
            }
            case ("start"): {
                bdsCallStatus = "online";
                if (bdsStatus === "offline") {
                    startBedrockDedicatedServer();
                } else {
                    console.log(chalk.bgWhiteBright.black("Server is already running."))
                }
                break;
            }
            case ("restart"): {
                bdsCallStatus = "online";
                if (bdsStatus === "online") {
                    runCommand("stop");
                } else if (bdsStatus === "offline") {
                    startBedrockDedicatedServer();
                } else {
                    console.log(chalk.bgWhiteBright.black(`Could not restart the server. The server is ${bdsStatus}.`))
                }
                break;
            }
            case ("cease"): {
                if (bdsStatus === "online") {
                    ceaseBedrockDedicatedServer();
                } else {
                    bdsCallStatus = "offline";
                }
                break;
            }
            default: {
                if (mc) mc.stdin.write(data);
                else console.log(chalk.bgWhiteBright.black("BDS is currently not connected."))
            }
        }
    }
});

function runCommand(command) {
    if (mc) mc.stdin.write(command + "\n");
    else console.log(chalk.bgWhiteBright.black("BDS is currently not connected."));
}


//Backups
let backupInterval = null;
function startBackups() {
    if (backupInterval) clearInterval(backupInterval);
    if (config["auto-backup"] == 0) return;
    backupInterval = setInterval(startBackup, config["auto-backup"] * 60 * 60 * 1000);
}
function startBackup() {
    console.log(chalk.bgWhite.black("Starting Backup..."));
    if (!fs.existsSync(config["backup-directory"] || "./backups")) {
        console.error(chalk.bgRedBright.black("Could not find backup-directory! Cancelling Backup."));
        takingBackup = "idle";
        return;
    }
    io.in("authed").emit("backupStarted");
    runCommand("save hold");
    takingBackup = "holding";
    setTimeout(queryBackup, 2000);
}
function queryBackup() {
    if (takingBackup === "holding") {
        runCommand("save query");
        setTimeout(queryBackup, 2000);
    }
}
function copyBackup(files) {
    const distDir = `${(config["backup-directory"] || "./backups")}/${(new Date()).toISOString().split(".")[0].replace("T", " T ").replace(/:/g, "-")}`;
    try {
        fs.mkdirSync(distDir);

        let copied = 0;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            fs.cp(`./BDS/worlds/${file}`, `${distDir}/${file}`, (err) => {
                if (err) console.warn(chalk.bgRed.yellowBright(`Warning: A backup file failed to save. (${file})\n`, err))
                copied++;
                progressBackup(copied, files.length, distDir);
            });
        }
    } catch (e) {
        console.error(chalk.bgRedBright.black("ERROR: Failed to copy backup.\n", e));
        runCommand("save resume");
        takingBackup = "idle";
        io.in("authed").emit("backupFailed");
    }
}
async function progressBackup(completedFiles, totalFiles, distDir) {
    if (completedFiles === totalFiles) {
        runCommand("save resume");
        console.log(chalk.bgWhite.rgb(255, 154, 0)("Compressing Backup..."));
        if (config["OS"] === "windows") {
            try {
                execSync(`"C:\\Program Files\\7-Zip\\7z.exe" -sdel a "../${distDir.split("/").pop()}.zip" *`, {
                    cwd: distDir
                });
                fs.rmdirSync(distDir);
            } catch (e) {
                console.log(chalk.bgRedBright.whiteBright("ZIPPING BACKUP FAILED! (Make sure 7-Zip is installed and in the default installation directory.)\n"), e)
            }
        }
        io.in("authed").emit("backupFinished");
        console.log(chalk.bgWhite.green("Backup Finished!"));
        takingBackup = "idle";
    } else {
        console.log(chalk.bgWhite.green(`Downloading Progress: ${completedFiles}/${totalFiles} (${Math.floor((completedFiles / totalFiles) * 100)}%)`));
    }
}

function reloadConfig() {//Change this to restart this service
    config = require("./master-config.json");
    startBackups();
    console.log(chalk.bgWhite.black("Config Reloaded. (Notice: some items can't be reloaded.)"));
}

const httpServer = http.createServer((req, res) => {
    console.log(chalk.bgWhiteBright.blue(req.url));

    res.end(fs.readFileSync("./master-deps/master-directory/unsecure_redirect.html"));
});
httpServer.listen(80);

const options = {
    key: fs.readFileSync(config["https-key"]),
    cert: fs.readFileSync(config["https-cert"])
};
const httpsServer = https.createServer(options, async (req, res) => {
    console.log(chalk.bgWhiteBright.blue(`https- ${req.socket.remoteAddress} ==> ${req.url}`));
    const {
        cookies,
        p,
        query,
        inputContentType,
        url,
        pathname
    } = await xeronParts.learn(req, res);
    console.log("cookies: ", cookies);
    console.log("p: ", p);
    console.log("query: ", query);
    console.log("pathname: ", pathname);

    let path = pathname;
    if (typeof path !== "string" || path.includes("//")) {
        send404();
        return;
    }
    if (path.startsWith("/")) path = path.slice(1);
    path = path.split("/");
    let filename;
    if (path[path.length - 1].includes(".")) {
        filename = path.pop();
    } else {
        filename = "index.html";
    }

    if (filename.startsWith(".")) {
        send404();
        return;
    }

    for (let i = 0; i < path.length; i++) {
        if (path[i].includes(".") || sanitizePath(path[i]) !== path[i]) {
            send404();
            return;
        }
    }


    const user = {
        authed: false,
        session_token: null,
        admin: null,
        developer: null,
        mason: null,
        helper: null,
        did: null,
        access_token: null,
        refresh_token: null,
        expires_in: null,
        discordUser: null
    }

    /**
     * @typedef {Object} Avatar_Decoration_Data
     * @property {String} asset
     * @property {String} sku_id
     * @property {String | Date | null} expires_at
     */
    /**
     * @typedef {Object} Discord
     * @property {BigInt} ID
     * @property {String} username
     * @property {String} avatar
     * @property {String} discriminator
     * @property {String | null} banner
     * @property {String | null} accentColor
     * @property {String | null} globalName
     * @property {Avatar_Decoration_Data} avatarDecorationData
     * @property {String | null} bannerColor
     * @property {String | null} clan
     * @property {String | null} locale
     */
    /**
     * @typedef {Object} Minecraft
     * @property {BigInt} XUID
     * @property {String} username
     */
    /**
     * @typedef {Object} User
     * @property {Discord} Discord
     * @property {Minecraft} Minecraft
     */

    /**
     * @type {User}
     */
    const injectUser = {
        Discord: {
            ID: null,
            username: null,
            avatar: null,
            discriminator: null,
            banner: null,
            accentColor: null,
            globalName: null,
            avatarDecorationData: {
                asset: null,
                sku_id: null,
                expires_at: null
            },
            bannerColor: null,
            clan: null,
            locale: null
        },
        Minecraft: {
            XUID: null,
            username: null
        }
    }

    if (cookies.session_token) {
        try {
            const session = await DB.findSessionJoinedDiscordByToken(cookies.session_token);
            if (session.error) {
                throw new Error("DATABASE LOGIN ERROR")
            }

            if (!(session && session.length > 0)) {
                throw new Error("Session token provided, but could not find it.");
            }

            if (session[0].did && session[0].session_token) {
                user.access_token = session[0].access_token
                user.refresh_token = session[0].refresh_token
                user.expires_in = session[0].expires_in
                user.admin = session[0].admin;
                user.developer = session[0].developer;
                user.mason = session[0].mason;
                user.helper = session[0].helper;
                user.did = session[0].did;
                user.session_token = cookies.session_token;
                user.authed = true;
            }

        } catch (e) {
            console.warn(chalk.bgRedBright.whiteBright("Failed to login with session token."), e)
        }
    }

    if ((!user.authed) && query.code) {
        console.log("Logging in Web user Using Discord.")
        try {
            const response = await fetch("https://discord.com/api/oauth2/token", {
                method: "POST",
                body: new URLSearchParams([
                    ["code", query.code],
                    ["grant_type", "authorization_code"],
                    ["redirect_uri", "https://kingdoms.cloudcue.net/dashboard.html"]
                ]).toString(),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": DiscordOAuth.basicAuth
                }
            });
            if (response.ok) {
                /**
                 * @typedef {Object} AccessTokenResponse
                 * @property {String} token_type
                 * @property {String} access_token
                 * @property {String} refresh_token
                 * @property {Number} expires_in
                 * @property {String} scope
                 */
                /**
                 * @type {AccessTokenResponse}
                 */
                const AccessTokenResponse = await response.json();

                if (AccessTokenResponse.token_type && AccessTokenResponse.access_token && AccessTokenResponse.expires_in && AccessTokenResponse.refresh_token && AccessTokenResponse.scope) {
                    console.log(AccessTokenResponse);
                    console.log("User Identified... Grabbing Discord information.");
                    const discordUser = await get_discord_user_data_via_access_token(AccessTokenResponse.access_token, AccessTokenResponse.refresh_token, AccessTokenResponse.expires_in)
                    if (discordUser) {
                        user.discordUser = discordUser;


                        const userInfo = await DB.getDiscordUserAndMinecraftPlayerByDID(discordUser.id);
                        console.log("discordUser> ", discordUser)
                        console.log("injectUser> ", injectUser)
                        console.log("UserInfo> ", userInfo)

                        if (userInfo?.xuid) injectUser.Minecraft.XUID = userInfo.xuid;
                        if (userInfo?.username) injectUser.Minecraft.username = userInfo.username;

                        if (userInfo?.did && typeof userInfo?.admin === "boolean") {
                            user.admin = userInfo.admin;
                            user.developer = userInfo.developer;
                            user.mason = userInfo.mason;
                            user.helper = userInfo.helper;
                            user.did = userInfo.did;
                            user.session_token = await DB.createSessionToken(user.did);
                            if (user.session_token) {
                                DB.updateDiscordUser(user.did, {
                                    access_token: AccessTokenResponse.access_token,
                                    refresh_token: AccessTokenResponse.refresh_token,
                                    expires_in: new Date((new Date()).getTime() + (AccessTokenResponse.expires_in * 1000))
                                })
                            }
                            user.authed = true;
                        } else {
                            try {
                                let sql = `INSERT INTO discord_users (did, access_token, refresh_token, expires_in) VALUES (:did, :access_token, :refresh_token, :expires_in);`;
                                await DB.sequelize.query(sql, { 
                                    replacements: {
                                        did: discordUser.id,
                                        access_token: AccessTokenResponse.access_token,
                                        refresh_token: AccessTokenResponse.refresh_token,
                                        expires_in: new Date((new Date()).getTime() + (AccessTokenResponse.expires_in * 1000))
                                    }
                                });
                                user.session_token = await DB.createSessionToken(user.did);
                                sql = `INSERT INTO discord_users (did, access_token, refresh_token, expires_in) VALUES (:did, :access_token, :refresh_token, :expires_in);`;
                                await DB.sequelize.query(sql, { 
                                    replacements: {
                                        did: discordUser.id,
                                        access_token: AccessTokenResponse.access_token,
                                        refresh_token: AccessTokenResponse.refresh_token,
                                        expires_in: new Date((new Date()).getTime() + (AccessTokenResponse.expires_in * 1000))
                                    }
                                });
                            } catch (e) {
                                console.error('Error inserting Discord user:', e);
                            }
                        }

                    } else {
                        //repsonse not okay
                        console.log(chalk.redBright("Discord Information Grab Failed."));
                    }
                }
            } else {
                //repsonse not okay
                console.log(chalk.redBright("Discord Verification Failed."), response);
                console.log(await response.json());
            }
        } catch (e) {
            console.log(chalk.redBright("Discord Verification Failed."), e)
        }
    }





    function apiSuccessHeader() {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });
    }
    if (pathname.startsWith("/dev2/api/process")) {
        const data = execSync("pm2 jlist").toString();
        apiSuccessHeader();
        res.end(data);
        return
    }



    function successHeader() {
        let setCookies = [];
        if (user.authed) {
            setCookies.push(`session_token=${user.session_token}; Path=/`);
        }
        res.writeHead(200, {
            "Set-Cookie": setCookies,
            "Content-Type": "text/html"
        });
    }
    function send404() {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(fs.readFileSync("./master-deps/master-directory/404.html"));
    }

    const filePath = `./master-deps/master-directory/${path.join("/")}/${filename}`;
    console.log(chalk.greenBright(filePath))
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
        let data = fs.readFileSync(filePath);
        if (filePath.endsWith(".html")) {
            if (data.includes("<Inject>ServerAuthedUser</Inject>")) {
                if (user.authed) {
                    if (!user.discordUser) {
                        const discordUser = await get_discord_user_data_via_access_token(user.access_token, user.refresh_token, user.expires_in)
                        if (!discordUser) {
                            console.error("Could not grab discord data.");
                        }
                        user.discordUser = discordUser;
                        console.log(discordUser);
                    }
                    if (user.discordUser) {
                        injectUser.Discord.ID = user.discordUser.id;
                        injectUser.Discord.username = user.discordUser.username;
                        injectUser.Discord.avatar = user.discordUser.avatar;
                        injectUser.Discord.discriminator = user.discordUser.discriminator;
                        injectUser.Discord.banner = user.discordUser.banner;
                        injectUser.Discord.accentColor = user.discordUser.accent_color;
                        injectUser.Discord.globalName = user.discordUser.global_name;
                        injectUser.Discord.bannerColor = user.discordUser.banner_color;
                        injectUser.Discord.clan = user.discordUser.clan;
                        injectUser.Discord.locale = user.discordUser.locale;
                        injectUser.Discord.avatarDecorationData.asset = user.discordUser.avatar_decoration_data?.asset;
                        injectUser.Discord.avatarDecorationData.sku_id = user.discordUser.avatar_decoration_data?.sku_id;
                        injectUser.Discord.avatarDecorationData.expires_at = user.discordUser.avatar_decoration_data?.expires_at;
                    }
                    data = data.toString().replace('"<Inject>ServerAuthedUser</Inject>"', JSON.stringify(injectUser));
                } else {
                    //user not authed
                    data = data.toString().replace('"<Inject>ServerAuthedUser</Inject>"', `{"authed":false}`);

                }
            }
        }
        successHeader();
        res.end(data);
        return;
    }
    send404();
    return;
});
httpsServer.listen(443);

const io = new Server(httpsServer);

io.on('connection', async (socket) => {
    console.log(chalk.bgWhiteBright.black("Control Panel Connected."));
    const user = {
        authed: false,
        admin: null
    };
    const cookies = xeronParts.getCookies(socket.handshake);
    if (cookies?.session_token) {
        
        try {
            const session = await DB.findSessionJoinedDiscordByToken(cookies.session_token);
            if (session.error) {
                throw new Error("DATABASE LOGIN ERROR")
            }

            if (!(session && session.length > 0)) {
                throw new Error("Session token provided, but could not find it.");
            }

            if (session[0].did && session[0].session_token) {
                user.access_token = session[0].access_token
                user.refresh_token = session[0].refresh_token
                user.expires_in = session[0].expires_in
                user.admin = session[0].admin;
                user.developer = session[0].developer;
                user.mason = session[0].mason;
                user.helper = session[0].helper;
                user.did = session[0].did;
                user.session_token = cookies.session_token;
                user.authed = true;
                
            socket.emit("auth", {
                success: true,
                sessionData: {
                    admin: user.admin,
                    developer: user.developer,
                    helper: user.helper,
                    did: user.did
                }
            })
            } else {
                throw new Error("Invalid user data, couldn't login.")
            }

        } catch (e) {
            console.warn(chalk.bgRedBright.whiteBright("Failed to login socket.io with session token."), e);
            socket.emit("auth", {
                success: false
            })
        }
    } else {
        
        socket.emit("auth", {
            success: false
        })
    }
    socket.on("test", async (data) => {
        if (!user.authed) return;
    });

    socket.on("runCommand", async (data) => {
        if (!user.authed) return;

    })
});

const sanitizePath = (path) => {
    return path.replace(/[^a-zA-Z0-9_\/]/g, '');
}

async function get_discord_user_data_via_access_token(access_token, refresh_token, expires_in) {
    console.log("User Identified... Grabbing Discord information.");
    const response = await fetch("https://discord.com/api/users/@me", {
        method: "GET",
        headers: {
            "authorization": `Bearer ${access_token}`
        }
    });
    if (response.ok) {
        /**
         * @typedef {Object} Avatar_Decoration_Data
         * @property {String} asset
         * @property {String} sku_id
         * @property {String | Date | null} expires_at
         */
        /**
         * @typedef {Object} DiscordResponse
         * @property {BigInt} id
         * @property {String} username
         * @property {String} avatar
         * @property {String} discriminator
         * @property {String | null} banner
         * @property {String | null} accent_color
         * @property {String | null} global_name
         * @property {Avatar_Decoration_Data} avatar_decoration_data
         * @property {String | null} banner_color
         * @property {String | null} clan
         * @property {String | null} locale
         */

        /**
         * @type {DiscordResponse} DiscordUserInfo
         */
        const DiscordUserInfo = await response.json();
        return DiscordUserInfo;
    } else {
        //repsonse not okay
        console.log(chalk.redBright("Discord Information Grab Failed."), response);
        console.log(await response.json());
        return false;
    }
}