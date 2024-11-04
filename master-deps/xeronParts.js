const mime = require('mime-types');
const url = require("url");
const fs = require("fs");


exports.learn = function (req, res) {
    return new Promise((resolve, reject) => {

        const cookies = getCookies(req);
        const q = url.parse(req.url, true).query;
        let p = {};


        //start parsing POST data
        let chunksIndex = 0;
        
        const tempFile = `temp/${Math.floor(Math.random() * 10000000)}.txt`;
        const fileWriteStream = fs.createWriteStream(tempFile);

        req.on('data', chunk => {
            console.log("Received chunk ", ++chunksIndex);
        });

        req.pipe(fileWriteStream);


        req.on('end', () => {//all POST data recieved
            console.log("Req data stream ended.");
            fileWriteStream.end();

        });
        req.on("error", (error) => {
            console.log("httpHandler.js: pipe error.")
            console.error(error);
            reject(error);
        })
        fileWriteStream.on('finish', () => {
            const chunks = fs.readFileSync(tempFile);
            fs.unlink(tempFile, (err) => {
                console.error(err);
            });

            let inputContentType = null;
            if (req.headers['content-type']) {//content type is defined
                let contentType = req.headers['content-type'].split(";");
                if (contentType[0] == "multipart/form-data") {
                    /*
                    commonly used when submitting forms that include file uploads.
                    The multipart/form-data encoding allows for efficient transmission
                    of binary data by breaking it into smaller parts (multipart) and
                    including each part in a separate section of the HTTP request.
                    */
                    let boundary = getBoundary(req.headers['content-type']);
                    let parts = multipartFormDataParser(chunks, boundary);
                    p = parts;
                    inputContentType = "multipart/form-data";
                }
                else if (contentType[0] == "application/x-www-form-urlencoded") {
                    /*
                    used in HTTP requests to send form data as a series of key-value pairs.
                    This encoding is the default for simple HTML forms, where the form data
                    is URL-encoded before being sent to the server. In this encoding,
                    spaces are replaced by + and special characters are replaced
                    with their corresponding percent-encoded values.
                    */

                    //Its basically the same as a GET request, so by putting it in the
                    //end of a normal looking url, we can parse it the exact same.
                    p = url.parse("localhost/nothing?" + chunks.toString(), true).query;
                    inputContentType = "application/x-www-form-urlencoded";
                }
                else if (contentType[0] == "application/json") {
                    //This is rarely used to send data to a server, but could
                    //simplify development of new pages.
                    try {
                        p = JSON.parse(chunks.toString());
                        inputContentType = "application/json";
                    } catch (error) {
                        console.error(error);
                        p = error;
                    }
                }
            }
            if (chunks.length > 0 && inputContentType === null) {
                //incase there is data sent, but we dont know what that is.
                p = url.parse("localhost/nothing?" + chunks.toString(), true).query;
                inputContentType = "unknown-application/x-www-form-urlencoded";
            }
            resolve({
                cookies,
                p,
                query: q,
                inputContentType,
                url: req.url,
                method: req.method,
                pathname: url.parse(req.url, true).pathname
            });
        })
    });
}


// This function takes an HTTP request object as input and extracts
// and parses the cookies from the request headers.
function getCookies(request) {
    // Initialize an empty object to store the extracted cookies.
    const list = {};

    // Get the 'cookie' header from the request headers.
    const cookieHeader = request.headers?.cookie;

    // If the 'cookie' header is not present, return an empty object.
    if (!cookieHeader) return list;

    // Split the 'cookie' header into individual cookies using the ';'.
    cookieHeader.split(`;`).forEach(function (cookie) {
        // Split each cookie into its name and value components using '='.
        let [name, ...rest] = cookie.split(`=`);

        // Trim any leading or trailing whitespace from the cookie name.
        name = name?.trim();

        // If the cookie name is empty, skip to the next iteration.
        if (!name) return;

        // Join the remaining parts as the cookie value and trim any leading or trailing whitespace.
        const value = rest.join(`=`).trim();

        // If the cookie value is empty, skip to the next iteration.
        if (!value) return;

        // Decode the cookie value and add it to the 'list' object with the name as the key.
        list[name] = decodeURIComponent(value);
    });

    // Return the object containing the parsed cookies.
    return list;
}
exports.getCookies = getCookies;

// This function parses multipart/form-data, extracting form fields and files
// from the provided 'body' using the specified 'boundary'.
// const multipartFormDataParser = function (body, boundary) {
//     // Write the entire body to a file for debugging purposes.
//     fs.writeFileSync("recentForm.txt", body);

//     // Initialize an empty object to store the parsed form fields and files.
//     const result = {};

//     // Split the body into individual parts using the specified 'boundary'.
//     body.split(boundary).forEach(item => {
//         // Check if the part contains a file (indicated by 'filename' attribute).
//         if (/filename=".+"/g.test(item)) {
//             // Extract the text content of the file.
//             let textContent = item.slice(
//                 item.search(/Content-Type:\s.+/g) + item.match(/Content-Type:\s.+/g)[0].length + 4,
//                 -4
//             );

//             // Extract information about the file and add it to the result object.
//             result[item.match(/name=".+";/g)[0].slice(6, -2)] = {
//                 type: 'file',
//                 filename: item.match(/filename=".+"/g)[0].slice(10, -1),
//                 contentType: item.match(/Content-Type:\s.+/g)[0].slice(14),
//                 textContent: textContent,
//                 content: Buffer.from(textContent, 'binary')
//             };
//         }
//         // Check if the part contains a form field.
//         else if (/name=".+"/g.test(item)) {
//             // Extract the value of the form field and add it to the result object.
//             result[item.match(/name=".+"/g)[0].slice(6, -1)] = item.slice(
//                 item.search(/name=".+"/g) + item.match(/name=".+"/g)[0].length + 4,
//                 -4
//             );
//         }
//     });

//     // Return the object containing the parsed form fields and files.
//     return result;
// };

//FUNCTION UPDATED TO WORK WITH BUFFER INSTEAD OF STRING
const multipartFormDataParser = function (bodyBuffer, boundary) {
    //Write the entire bodyBuffer to a file for dubugging perposes.
    fs.writeFileSync("recentForm.txt", bodyBuffer);

    const result = {};

    // Find the boundary positions in the buffer.
    let boundaryIndex = bodyBuffer.indexOf(boundary);
    let startPos = boundaryIndex + boundary.length + 2; // Plus 2 to skip the initial CRLF after the boundary.

    while (true) {
        // Find the end position of the current part.
        const endPos = bodyBuffer.indexOf(boundary, startPos);
        console.log("Processing part ", startPos, " to ", endPos);

        // If no more boundary found, break the loop.
        if (endPos < 0) break;

        // Get the current part buffer.
        const partBuffer = bodyBuffer.slice(startPos, endPos - 4); // Subtracting 2 to exclude the trailing CRLF. another 2?

        // Check if the part contains a file (indicated by 'filename' attribute).
        if (partBuffer.includes('filename=')) {
            // Extract information about the file and add it to the result object.
            const contentStartIndex = bodyBuffer.indexOf('\r\n\r\n', startPos) + 4;
            const contentEndIndex = bodyBuffer.indexOf(boundary, contentStartIndex)-4;

            result[partBuffer.slice(partBuffer.indexOf('name="') + 6, partBuffer.indexOf('";')).toString()] = {
                type: 'file',
                filename: partBuffer.slice(partBuffer.indexOf('filename="') + 10, partBuffer.indexOf('"', partBuffer.indexOf('filename="') + 10)).toString(),
                contentType: partBuffer.slice(partBuffer.indexOf('Content-Type: ') + 14, partBuffer.indexOf('\r\n', partBuffer.indexOf('Content-Type: ') + 14)).toString(),
                content: bodyBuffer.slice(contentStartIndex, contentEndIndex)
            };
        }
        // Check if the part contains a form field.
        else if (partBuffer.includes('name=')) {
            // Extract information about the form field and add it to the result object.
            const fieldName = partBuffer.slice(partBuffer.indexOf('name="') + 6, partBuffer.indexOf('";')).toString();
            const fieldValueStartIndex = partBuffer.indexOf('\r\n\r\n') + 4;
            const fieldValueEndIndex = partBuffer.length - 2; // Exclude the final CRLF
            const fieldValue = partBuffer.slice(fieldValueStartIndex, fieldValueEndIndex).toString();
            result[fieldName] = fieldValue;
        }

        // Update the start position for the next part.
        boundaryIndex = bodyBuffer.indexOf(boundary, endPos);
        startPos = boundaryIndex + boundary.length + 2; // Plus 2 to skip the initial CRLF after the boundary.
    }

    // Return the object containing the parsed form fields and files.
    console.log("Done");
    return result;
};

const getBoundary = function (header) {
    let items = header.split(';');
    if (items)
        for (i = 0; i < items.length; i++) {
            let item = (new String(items[i])).trim();
            if (item.indexOf('boundary') >= 0) {
                let k = item.split('=');
                return (new String(k[1])).trim();
            }
        }
    return "";
}
