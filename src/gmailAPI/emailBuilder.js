function removeAttachmentsFromMime(payload) {
  let boundary = "fg3q44wh5456u56jg0051265";
  let headers = prepareHeaders(payload);  // Get headers
  let body = prepareBody(payload, boundary, true);        // Get the body (text/html and attachments)

  // Combine headers and body into a final MIME message
  let mimeMessage = headers + body;

  return mimeMessage;
}

function prepareHeaders(payload) {
  // Add MIME Version and Content-Type (set to multipart/mixed by default)
  let headers = "MIME-Version: 1.0\r\n";
  // Loop through all headers and concatenate them
  payload.headers
    .filter(h => !["Content-Type", "MIME-Version"].includes(h.name))
    .forEach(header => {
      value = header.value

      if (["Subject", "To", "From", "CC", "BCC", "X-Original-From", "Reply-To"].includes(header.name)) {
        value = encodeNonASCIIHeader(header.value);
      }

      headers += header.name + ": " + value + "\r\n";
  });
  
  return headers;
}

function prepareBody(payload, boundary_parent, top_header=false) {
  let body = "";
  
  // Check if it's a single part message or multipart
  if (payload.parts) {
    let boundary = incrementLastTwoDigits(boundary_parent)

    if (!top_header)
      body += "--" + boundary_parent + "\r\n";
    body += "Content-Type: " + payload.mimeType + "; boundary=\"" + boundary + "\"\r\n\r\n";

    // If it's multipart, loop through each part
    payload.parts.forEach(part => {
      body += prepareBody(part, boundary)
    });

    // Add closing boundary
    body += "--" + boundary + "--\r\n";
  } else {
      body += "--" + boundary_parent + "\r\n";

      if (['text/plain', 'text/html', 'text/enriched'].includes(payload.mimeType) && payload.filename == "") {
        body += "Content-Type: " + payload.mimeType + "; charset=\"UTF-8\"\r\n";
        body += "Content-Transfer-Encoding: base64\r\n\r\n";
        body += encodeContent(decodeBody(payload.body.data)) + "\r\n";
      } else if (payload.filename) {
        // This is an attachment
        let safeFilename = encodeMimeHeader(payload.filename.toString())
        body += "Content-Type: " + payload.mimeType + "; name=\"Deleted: " + safeFilename + "\"\r\n";
        body += "Content-Disposition: attachment; filename=\"Deleted: " + safeFilename + "\"\r\n";
        body += "Content-Transfer-Encoding: base64\r\n\r\n";
      } else {
        throw Error("Payload not supported - mimeType is " + payload.mimeType)
      }
  }


  return body;
}

/**
 * Encodes a filename in MIME Q format to preserve special characters
 */
function encodeMimeHeader(text) {
  return '=?UTF-8?Q?' + encodeURIComponent(text).replace(/%/g, '=') + '?=';
}

// Function to base64 encode the content text
function encodeContent(content) {
  var utf8Blob = Utilities.newBlob(content, 'text/plain', 'utf8');  // Convert the content to a UTF-8 blob
  return Utilities.base64Encode(utf8Blob.getBytes()); // Base64 encode the content
}

function decodeBody(data) {
  if (data == undefined) return "";

  if (Array.isArray(data)) {
    // Convert the array of integers into a Uint8Array
    let byteArray = new Uint8Array(data);

    // Decode UTF-8 bytes into a string
    return Utilities.newBlob(byteArray).getDataAsString();
  }

  return data;  // If it's already a string, return as-is
}

function incrementLastTwoDigits(str) {
  // Extract the last two characters from the string
  let lastTwoDigits = str.slice(-2);
  
  // Convert the last two characters to an integer
  let incrementedDigits = parseInt(lastTwoDigits) + 1;
  
  // If the incremented value is greater than 99, reset to 00
  if (incrementedDigits > 99) {
    incrementedDigits = 0;
  }

  // Replace the last two digits with the incremented value
  let newStr = str.slice(0, -2) + String(incrementedDigits).padStart(2, '0');
  
  return newStr;
}

function parseEmailsWithNames(headerValue) {
  // Updated regex to also match standalone email addresses
  var regex = /"([^"]+)"\s*<([^>]+)>|([^,<]+)\s*<([^>]+)>|([\w.-]+@[\w.-]+)/g;
  var results = [];
  var match;

  while ((match = regex.exec(headerValue)) !== null) {
    var name = "";
    var email = "";

    if (match[1] && match[2]) {
      // "Name" <email@example.com>
      name = match[1];
      email = match[2];
    } else if (match[3] && match[4]) {
      // Name <email@example.com>
      name = match[3].trim();
      email = match[4];
    } else if (match[5]) {
      // Standalone email (no name)
      email = match[5];
    }

    results.push({ name: name, email: email });
  }

  return results;
}

function encodeNonASCIIHeader(headerValue) {
  // Is it an email list?
  emails = parseEmailsWithNames(headerValue)

  if (emails.length === 0)
    return encodeMimeHeader(headerValue)
  
  encodedEmails = []
  emails.forEach(function(email) {
    if (email.name != '') {
      encodedEmails.push(encodeMimeHeader(email.name) + ' <' + email.email + '>');
    } else {
      encodedEmails.push(email.email);
    }
  });

  return encodedEmails.join(',')
}
