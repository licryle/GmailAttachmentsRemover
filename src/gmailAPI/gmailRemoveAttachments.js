function duplicateEmailWithoutAttachments(message, removeLabel='', addLabel='') {
  var userId = 'me'; // 'me' refers to the authenticated user
  var messageId = message.getId(); // Get the message ID

  // Step 1: Get email details
  var messageData = Gmail.Users.Messages.get(userId, messageId);
  var newPayload = removeAttachmentsFromMime(messageData.payload)
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

function removeAttachments(processLabel, processedLabel, dryRunMode) {
  Logger.log("Batch processing starting in DryRunMode %s", dryRunMode)
  Logger.log("Searching emails that match -- label:%s", processLabel)
  var threads = GmailApp.search("-in:trash label:" + processLabel,0,100);
  Logger.log("Found %s threads", threads.length)

  try {
    threads.forEach(function(thread) {
      removeAttachment(thread, processLabel, processedLabel, dryRunMode)
    })
  } catch(e) {
    return e;
  }

  Logger.log("Done processing %s threads", threads.length)
  return "Attachments removed successfully!"
}

function removeAttachment(thread, processLabel, processedLabel, dryRunMode) {
  test = ''
  Logger.log("Single processing starting in DryRunMode %s", dryRunMode)
  Logger.log("******************[%s]******************", thread.getFirstMessageSubject())
  Logger.log("-> %s messages", thread.getMessageCount())

  test += thread.getFirstMessageSubject();
  test += ' has ' + thread.getMessageCount() + ' messages.';

  try {
    thread.getMessages().forEach(function(email) {
      Logger.log("[%s] --> %s attachments", email.getId(), email.getAttachments().length)

      let nonDelAttachmentsNB = 0;
      email.getAttachments().forEach(function(attachment) {
        if (! attachment.getName().startsWith("Deleted: "))
          nonDelAttachmentsNB++;
      })

      if (nonDelAttachmentsNB > 0) {
        var userId = "me"
        var emailId = email.getId(); // Get the message ID

        Logger.log("[%s] Non-deleted attachements, let's process", emailId)
        if (dryRunMode < 2) {
          duplicateEmailWithoutAttachments(email, processLabel, processedLabel)
        }

        if (dryRunMode < 1) {
          // Step 7: Delete the original message after duplication
          Gmail.Users.Messages.trash(userId, emailId);
        }

        Logger.log('[%s] Original message deleted.', emailId);
        Logger.log('[%s] Email replaced without attachments successfully', emailId);
      } else {
        Logger.log("[%s] All attachements deleted, no need to process", emailId)
      }
    })
    Logger.log("******************[%s]******************", thread.getFirstMessageSubject())
  } catch(e) {
    return e;
  }
  return "Attachments removed successfully!"
}