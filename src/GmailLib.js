function duplicateEmailWithoutAttachments(message, removeLabel='', addLabel='') {
  var userId = 'me'; // 'me' refers to the authenticated user
  var messageId = message.getId(); // Get the message ID

  // Step 1: Get email details
  var messageData = Gmail.Users.Messages.get(userId, messageId);
  var newPayload = messageToMimeString(messageData.payload)
  var rawMessage = Utilities.base64EncodeWebSafe(newPayload)
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); // Remove padding and URL-safe encoding

  // Step 5: Insert the email into Gmail
  var insertedMessage = Gmail.Users.Messages.insert(
    {
      raw: rawMessage, // Use the raw email content (base64url-encoded)
      threadId: message.getThread().getId(),
      labelIds: combineLabels(messageData, removeLabel, addLabel)
    },
    userId,
    null,
    {'internalDateSource': 'dateHeader'}
  );

  if (!insertedMessage) {
    throw new Error('[%s] Failed to insert email.', messageId);
  }
  Logger.log('[%s -> %s] Copie inserted', messageId, insertedMessage.id);
}
