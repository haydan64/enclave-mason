let config = require("./../master-config.json");
const Sequelize = require("sequelize");
const crypto = require("crypto");


const sequelize = new Sequelize(config["database"], config["database-username"], config["database-password"], {
    host: config["database-host"],
    dialect: config["database-dialect"]
});

// Test the database connection
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

async function insertSession(sessionToken, discordID) {
    try {
        const sql = `
            INSERT INTO sessions (session_token, created_at, updated_at, did, expires_at)
            VALUES (
                :sessionToken, 
                NOW(), 
                NOW(), 
                :did,
                NOW() + INTERVAL '1 week'
            );
        `;

        const [results, metadata] = await sequelize.query(sql, {
            replacements: { sessionToken, did:discordID }, // Safe insertion of values
            type: Sequelize.QueryTypes.INSERT // Specifies that this is an INSERT query
        });
        return {results, metadata};

        console.log('Insert Results:', results); // Metadata about the operation
        console.log('Metadata:', metadata); // Metadata about the query execution

    } catch (error) {
        console.error('Error inserting session:', error);
        return {error}
    }
}

async function createSessionToken(did) {
    const newToken = crypto.randomUUID();
    const insert = await insertSession(newToken, did);
    return newToken;
}

async function findSessionByToken(token) {
    try {
        const sql = `
            SELECT * FROM sessions
            WHERE session_token = :token;
        `;

        return await sequelize.query(sql, {
            replacements: { token }, // Use replacements to safely insert the token value
            type: Sequelize.QueryTypes.SELECT // Specifies that this is a SELECT query
        });

        console.log('Results:', results); // This will be an array of rows matching the token
        console.log('Metadata:', metadata); // Metadata about the query execution

    } catch (error) {
        console.error('Error finding session by token:', error);
        return {error}
    }
}

async function findSessionJoinedDiscordByToken(token) {
    try {
        // Combined query to get the session and the corresponding Discord user
        const sql = `
            SELECT s.*, du.*
            FROM sessions s
            INNER JOIN discord_users du ON s.did = du.did
            WHERE s.session_token = :token;
        `;

        return await sequelize.query(sql, {
            replacements: { token }, // Safely insert the token value
            type: Sequelize.QueryTypes.SELECT // Specifies that this is a SELECT query
        });

    } catch (error) {
        console.error('Error finding session by token:', error);
        return { error };
    }
}

async function findDiscordUserByDID(did) {
    try {
        const sql = `
            SELECT * FROM discord_users
            WHERE did = :did;
        `;

        return (await sequelize.query(sql, {
            replacements: { did }, // Use replacements to safely insert the token value
            type: Sequelize.QueryTypes.SELECT // Specifies that this is a SELECT query
        }))[0];

        console.log('Results:', results); // This will be an array of rows matching the token
        console.log('Metadata:', metadata); // Metadata about the query execution

    } catch (error) {
        console.error('Error finding discord user by DID:', error);
        return {error}
    }
}

async function getDiscordUserAndMinecraftPlayerByDID(did) {
    try {
        const sql = `
            SELECT du.*, mp.*
            FROM discord_users du
            LEFT JOIN account_links al ON du.did = al.did
            LEFT JOIN minecraft_players mp ON al.xuid = mp.xuid
            WHERE du.did = :did;
        `;

        return (await sequelize.query(sql, {
            replacements: { did }, // Safely insert the did value
            type: Sequelize.QueryTypes.SELECT // Specifies that this is a SELECT query
        }))[0];

    } catch (error) {
        console.error('Error retrieving Discord user and Minecraft player by did:', error);
        return { error };
    }
}
async function getDiscordUserAndMinecraftPlayerByXUID(xuid) {
    try {
        const sql = `
            SELECT du.*, mp.*
            FROM minecraft_players mp
            LEFT JOIN account_links al ON mp.xuid = al.xuid
            LEFT JOIN discord_users du ON al.did = du.did
            WHERE mp.xuid = :xuid;
        `;

        return (await sequelize.query(sql, {
            replacements: { xuid }, // Safely insert the xuid value
            type: Sequelize.QueryTypes.SELECT // Specifies that this is a SELECT query
        }))[0];

    } catch (error) {
        console.error('Error retrieving Discord user and Minecraft player by xuid:', error);
        return { error };
    }
}

/**
 * Dynamically updates the fields of a Discord user in the database using a raw SQL query.
 * @param {string} did - Discord user ID.
 * @param {Object} updateFields - Fields to update as key-value pairs.
 * @returns {Promise<Object>} The result of the update operation.
 */
async function updateDiscordUser(did, updateFields, updatedTimestamp) {
    try {
        if (Object.keys(updateFields).length === 0) {
            return { error: 'No fields to update' };
        }

        // Build the SET clause dynamically based on the keys in updateFields
        const setClauses = [];
        const replacements = { did }; // Initialize replacements object with did
        const entries = Object.entries(updateFields);

        for (const [key, value] of entries) {
            setClauses.push(`${key} = :${key}`); // Add each field dynamically
            replacements[key] = value; // Add the key-value pair to replacements
        }

        // Add updated_at to always update the timestamp
        if(updatedTimestamp) setClauses.push('updated_at = NOW()');

        // Construct the full SQL query
        const sql = `
            UPDATE discord_users
            SET ${setClauses.join(', ')}
            WHERE did = :did;
        `;

        // Execute the query
        const [result] = await sequelize.query(sql, {
            replacements, // Dynamically populated replacements object
        });

        // Check if any rows were affected (updated)
        if (result === 0) {
            return { error: 'Discord user not found or no changes made' };
        }

        // Return success message
        return { success: true, message: 'Discord user updated successfully' };

    } catch (error) {
        console.error('Error updating Discord user:', error);
        return { error };
    }
}

/**
 * Inserts or updates a Discord user in the database using a raw SQL query.
 * If the Discord user already exists (based on DID), it updates the fields.
 * @param {string} did - Discord user ID.
 * @param {Object} updateFields - Fields to update or insert as key-value pairs.
 * @returns {Promise<Object>} The result of the operation (insert or update).
 */
async function insertDiscordUser(did, updateFields) {
    try {
        if (Object.keys(updateFields).length === 0) {
            return { error: 'No fields to insert or update' };
        }

        // Add the did to the fields to ensure it is part of the INSERT operation
        updateFields.did = did;

        // Build the fields for both the insert and update
        const columns = Object.keys(updateFields).join(', ');
        const values = Object.keys(updateFields).map(field => `:${field}`).join(', ');
        const updates = Object.keys(updateFields).map(field => `${field} = EXCLUDED.${field}`).join(', ');

        // Construct the SQL query using PostgreSQL's "ON CONFLICT" clause
        const sql = `
            INSERT INTO discord_users (${columns})
            VALUES (${values})
            ON CONFLICT (did)
            DO UPDATE SET ${updates}, updated_at = NOW();
        `;

        // Execute the query with replacements for the values
        const [result] = await sequelize.query(sql, {
            replacements: updateFields // Pass in the key-value pairs to insert or update
        });

        // Return success message
        return { success: true, message: 'Discord user inserted or updated successfully' };

    } catch (error) {
        console.error('Error inserting or updating Discord user:', error);
        return { error };
    }
}


// Export models along with existing ones
module.exports = {
    sequelize,
    insertSession,
    createSessionToken,
    findSessionByToken,
    findSessionJoinedDiscordByToken,
    findDiscordUserByDID,
    getDiscordUserAndMinecraftPlayerByDID,
    getDiscordUserAndMinecraftPlayerByXUID,
    updateDiscordUser,
    query: sequelize.query
};