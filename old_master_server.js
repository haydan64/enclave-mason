const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const http = require("http");
const https = require("https");
const url = require('url');
const bcrypt = require("bcrypt")
const { Server } = require('socket.io');
let config = require("./master-config.json");
const chalk = require('chalk');
const serverProperties = {};
const DB = require("./master-deps/master-db.js")

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

let worldLocation = `BDS/worlds/${serverProperties["level-name"].value}`;
let logLocation = `${worldLocation}/master-logs`;
let lastLog = null;
let logStream = null;
function mLog(event, message) {
    const now = (new Date());
    const today = now.toDateString();
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

let players = {};
let weather = "clear";

if (config["auto-start-bds"]) startBedrockDedicatedServer();
function startBedrockDedicatedServer() {
    players = [];
    bdsStatus = "starting";
    mc = spawn('./BDS/bedrock_server.exe');
    mc.stdout.on("data", async (message) => {
        let showMessage = true;
        message = message.toString();
        if (message.includes(" INFO] Data saved. Files are now ready to be copied.")) {//Backup is ready.
            takingBackup = "copying";
            console.log(chalk.bgWhite.black("Backup is downloading..."));
            const files = message.split(" INFO] Data saved. Files are now ready to be copied.")[1].trim().split(", ")
                .map((value) => {
                    return value.split(":")[0].trim();
                });
            copyBackup(files);

        } else {
            message.split("\n").forEach(async (message) => {

                if (message.includes(" INFO] Player connected: ")) {
                    const [username, xuid] = message.split(" INFO] Player connected: ")[1].split(", xuid: ").map((value) => { return value.trim() });
                    console.log(`Player ${username} connected with ID ${xuid}`);
                    mLog("Player connected", `${username}, ${xuid}`);
                    if (!players[username]) {
                        players[username] = {
                            username, xuid
                        }
                    }
                } else if (message.includes(" INFO] Player disconnected: ")) {
                    const [username, xuid] = message.split(" INFO] Player disconnected: ")[1].split(", xuid: ").map((value) => { return value.trim() });
                    console.log(`Player ${username} Disconnected with ID ${xuid}`);
                    mLog("Player disconnected", `${username}, ${xuid}`);
                    delete players[username];
                } else if (message.includes(" INFO] [Scripting] [Player Spawned] ")) {
                    const msg = message.split(" INFO] [Scripting] [Player Spawned] ")[1];
                    try {
                        const p = JSON.parse(msg);
                        mLog("Player Spawned", msg);
                        if (p.username) {
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
                } else if (message.includes(" INFO] [Scripting] [Players Update] ")) {
                    showMessage = false;
                    try {
                        const ps = JSON.parse(message.split(" INFO] [Scripting] [Players Update] ")[1]);
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
                } else if (message.includes(" INFO] [Scripting] [Player Gamemode Change] ")) {
                    const msg = message.split(" INFO] [Scripting] [Player Gamemode Change] ")[1];
                    try {
                        const d = JSON.parse(msg);
                        mLog("Player Gamemode Change", msg);
                        if (d.player) {
                            const player = players[d.player];
                            if (player) {
                                player.gamemode = p.gamemode;
                            }
                            io.in("authed").emit("Place Gamemode Change", d);
                        }
                    }
                    catch (e) {
                        console.error(chalk.bgRedBright.black("Player Change Gamemode JSON Malformed. ", e))
                    };
                } else if (message.includes(" INFO] [Scripting] [Player Place] ")) {
                    const msg = message.split(" INFO] [Scripting] [Player Place] ")[1];
                    showMessage = false;
                    mLog("Player Place", msg);
                    try {
                        const d = JSON.parse(msg)
                        io.in("authed").emit("Player Place", d);
                    }
                    catch (e) {
                        console.error(chalk.bgRedBright.black("Player Place Block JSON Malformed. ", e))
                    };
                } else if (message.includes(" INFO] [Scripting] [Player Break] ")) {
                    const msg = message.split(" INFO] [Scripting] [Player Break] ")[1]
                    showMessage = false;
                    mLog("Player Break", msg);
                    try {
                        const d = JSON.parse(msg);
                        io.in("authed").emit("Player Break", d);
                    }
                    catch (e) {
                        console.error(chalk.bgRedBright.black("Player Break Block JSON Malformed. ", e))
                    };
                } else if (message.includes(" INFO] [Scripting] [Death] ")) {
                    const msg = message.split(" INFO] [Scripting] [Death] ")[1];
                    mLog("Death", msg);
                    try {
                        const d = JSON.parse(msg);
                        io.in("authed").emit("Death", d);
                    }
                    catch (e) {
                        console.error(chalk.bgRedBright.black("Death JSON Malformed. ", e))
                    };
                } else if (message.includes(" INFO] [Scripting] [Weather] ")) {
                    const msg = message.split(" INFO] [Scripting] [Weather] ")[1];
                    mLog("Weather", msg);
                    io.in("authed").emit("Weather", msg);
                } else if (message.includes(" INFO] Running AutoCompaction...")) {
                    showMessage = false;
                } else if (message.includes(" INFO] Server started.")) {
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
                        mLog("MC", message.slice(message.indexOf(":") + 11));
                    }
                }
                if (showMessage) console.log(`MC: ${message}`);
            });
        }
    });

    mc.stderr.on("data", message => {
        console.log(`stderr: ${message}`);
    });
    mc.on('error', (error) => {
        console.log(`error: ${error.message}`);
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
    runCommand("stop")
    bdsStatus = "shutting_down";
}

function ceaseBedrockDedicatedServer() {
    bdsCallStatus = "offline";
    stopBedrockDedicatedServer();
}

function getOnlinePlayerByXUID(xuid) {
    //for(let i = 0; i < players.length)
}
function getOnlinePlayerByUsername(username) {
    //for(let i = 0; i < players.length)
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
    takingBackup = "holding";
    if (mc) mc.stdin.write(command + "\n");
    else console.log(chalk.bgWhiteBright.black("BDS is currently not connected."))
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
    const distDir = `${(config["backup-directory"] || "./backups")}/${(new Date()).toGMTString().replace(/:/g, ",")}`;
    try {
        fs.mkdirSync(distDir);

        let copied = 0;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            fs.cp(`./BDS/worlds/${file}`, `${distDir}/${file}`, (err) => {
                if (err) console.warn(chalk.bgRed.yellowBright(`Warning: A backup file failed to save. (${file})\n`, err))
                copied++;
                progressBackup(copied, files.length);
            });
        }
    } catch (e) {
        console.error(chalk.bgRedBright.black("ERROR: Failed to copy backup.\n", e));
        runCommand("save resume");
        takingBackup = "idle";
        io.in("authed").emit("backupFailed");
    }
}
function progressBackup(completedFiles, totalFiles) {
    if (completedFiles === totalFiles) {
        runCommand("save resume");
        io.in("authed").emit("backupFinished")
        console.log(chalk.bgWhite.green("Backup Finished!"));
        takingBackup = "idle";
    } else {
        console.log(chalk.bgWhite.green(`Downloading Progress: ${completedFiles}/${totalFiles} (${Math.floor((completedFiles / totalFiles) * 100)}%)`));
    }
}

function reloadConfig() {
    config = require("./master-config.json");
    startBackups();
    console.log(chalk.bgWhite.black("Config Reloaded. (Notice: some items can't be reloaded.)"));
}

function createUser(username, password) {//TRANSITION TO DATABASE
    if (!fs.existsSync(`master-users/${username}`)) {
        fs.mkdirSync(`master-users/${username}`);
        fs.writeFileSync(`./master-users/${username}/passHash.txt`, bcrypt.hashSync(password, 10));
        fs.writeFileSync(`./master-users/${username}/authToken.txt`, generateToken(64));
        return true;
    } else {
        //User already exists.
        console.error(chalk.bgRed.greenBright("Error: User already exists."))
    }
}

function setPasswordUser(username, password) {//TRANSITION TO DATABASE
    if (fs.existsSync(`./master-users/${username}`)) {
        fs.writeFileSync(`./master-users/${username}/passHash.txt`, bcrypt.hashSync(password, 10));
        fs.writeFileSync(`./master-users/${username}/authToken.txt`, generateToken(64));
        return true;
    } else {
        //User already exists.
        console.error(chalk.bgRed.greenBright("Error: User Doesn't Exist."))
    }
}


const httpServer = http.createServer((req, res) => {
    console.log(chalk.bgWhiteBright.blue(req.url));
    const authheader = req.headers.authorization;
    if (authheader) {
        res.end(fs.readFileSync("./master-deps/master-panel/unsecure_redirect.html"));
    }

    res.end(fs.readFileSync("./master-deps/master-panel/unsecure_redirect.html"));
});
httpServer.listen(80);

const options = {
    key: fs.readFileSync(config["https-key"]),
    cert: fs.readFileSync(config["https-cert"])
};
const httpsServer = https.createServer(options, async (req, res) => {
    console.log(chalk.bgWhiteBright.blue(req.url));
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    const user = {
        authed: false,
        admin: null
    }

    const authheader = req.headers.authorization;

    if (!authheader) {
        console.log(chalk.bgWhiteBright.black("User Did not Auth"))
        res.setHeader('WWW-Authenticate', 'Basic');
        res.writeHead(401, "Not Authenticated.");
        res.end("Please Authenticate.");
        return;
    }


    const auth = new Buffer.from(authheader.split(' ')[1], 'base64').toString().split(":");
    const username = auth.shift().replace(/[^a-zA-Z0-9]/g, "_");
    const password = auth.join(":");
    const Admin = await DB.Admin.findOne({ where: { Username: username } });
    console.log(Admin);
    if (Admin) {
        const passHash = Admin.PasswordHash;
        if (bcrypt.compareSync(password, passHash)) {
            //correct password
            console.log(chalk.bgWhiteBright.blue(`${username} Loaded Control Panel.`));
            user.authed = true;
            delete Admin.PasswordHash;
            user.admin = Admin;
        }
    }

    if (!user.authed) {
        console.log(chalk.bgWhiteBright.red("User Auth Failed"))
        res.setHeader('WWW-Authenticate', 'Basic');
        res.writeHead(401, "Not Authenticated.");
        res.end("Please Authenticate.");
        return;
    }
    res.writeHead(200, {
        "Set-Cookie": [
            `authToken=${user.authToken}; Path=/`,
            `username=${user.username}; Path=/`
        ],
        "Content-Type": "text/html"
    });

    switch (path) {
        case '/':
            res.end(fs.readFileSync("./master-deps/master-panel/master_control_panel.html"));
            break;
        case '/shell':
            res.end(fs.readFileSync("./master-deps/master-panel/master_shell.html"));
            break;
        default:
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end(fs.readFileSync("./master-deps/master-panel/404.html"));
            break;
    }
});
httpsServer.listen(443);

const io = new Server(httpsServer);

io.on('connection', (socket) => {
    console.log(chalk.bgWhiteBright.black("Control Panel Connected."));
    const user = {
        authed: false,
        admin: null
    };
    socket.on("auth", async (data) => {
        const { authToken } = data;
        const Admin = await DB.Admin.findOne({ where: { AuthToken: authToken } }).dataValues
        if (Admin) {
            console.log(chalk.bgWhiteBright.blue(`${username} Connected to Control Panel.`))
            user.authed = true;
            user.admin = Admin;
            socket.emit("auth", {
                success: true
            });
            socket.emit("players", players);
            socket.emit("serverProperties", serverProperties);
            console.log(players);
            socket.join("authed");
        }
    })
    socket.on("test", async (data) => {
        if (!user.authed) return;
        console.log("Get Xuid", data.xuid);
        console.log(await DB.Users.findOne({ where: { Xuid: data.xuid } }).dataValues);
    });

    socket.on("runCommand", async (data) => {
        if (!user.authed) return;

    })
})