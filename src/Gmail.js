  /**
 * Callback for rendering the card for a specific Gmail message.
 * @param {Object} e The event object.
 * @return {CardService.Card} The card to show to the user.
 */
function onGmailMessage(e) {
  Logger.log(e)
  // Get an access token scoped to the current message and use it for GmailApp
  // calls.
  var accessToken = e.gmail.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);

  // Get the ID of the message the user has open.
  var thread = GmailApp.getThreadById(e.gmail.threadId);

  // Get the subject of the email.
  var subject = thread.getFirstMessageSubject();

  var ConfigStore = ConfigStore()
  var processLabel = ConfigStore.getLabelIn()
  var processedLabel = ConfigStore.getLabelOut()
  var dryRunMode = ConfigStore.getDryRunMode()
  Logger.log(dryRunMode);
  Logger.log(dryRunMode.toString());

  var action = CardService.newAction()
      .setFunctionName('removeAttachmentRemote')
      .setParameters({threadId: thread.getId(), processLabel: processLabel,
                      processedLabel: processedLabel, dryRunMode: dryRunMode.toString(),
                      accessToken: accessToken});
 
  var button_one = CardService.newTextButton()
      .setText('Delete Attachments from "' + subject + '"')
      .setOnClickAction(action)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

  var action = CardService.newAction()
      .setFunctionName('removeAttachmentsRemote')
      .setParameters({threadId: thread.getId(), processLabel: processLabel,
                      processedLabel: processedLabel, dryRunMode: dryRunMode.toString(),
                      accessToken: accessToken});
 
  var button_all = CardService.newTextButton()
      .setText('BatchRemove from ' + processLabel)
      .setOnClickAction(action)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

  var buttonSet = CardService.newButtonSet()
      .addButton(button_one)
      .addButton(button_all);

  // Assemble the widgets and return the card.
  var section = CardService.newCardSection()
      .addWidget(buttonSet);

  return createCard(section);
}

function removeAttachmentsRemote(e) {
  if (!e || !e.parameters || !e.parameters.processLabel
      || !e.parameters.processedLabel || !e.parameters.dryRunMode) {
      Logger.log("Error: Missing parameters.");
      return CardService.newActionResponseBuilder()
          .setNotification(CardService.newNotification()
          .setText("Error: Missing parameters"))
          .build();
  }

  var accessToken = e.messageMetadata.accessToken;
  if (!accessToken) {
      Logger.log("Error: Missing access token.");
      return CardService.newActionResponseBuilder()
          .setNotification(CardService.newNotification()
          .setText("Error: Missing access token"))
          .build();
  }
  Logger.log(e.parameters.dryRunMode);
  dryRunMode = parseInt(e.parameters.dryRunMode, 10)
  Logger.log(dryRunMode);

  // Set the access token
  GmailApp.setCurrentMessageAccessToken(accessToken);
  result = removeAttachments(e.parameters.processLabel, e.parameters.processedLabel, dryRunMode)

  return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
      .setText(result))
      .build();
}

function removeAttachmentRemote(e) {
  if (!e || !e.parameters || !e.parameters.threadId || !e.parameters.processLabel
      || !e.parameters.processedLabel || !e.parameters.dryRunMode) {
      Logger.log("Error: Missing parameters.");
      return CardService.newActionResponseBuilder()
          .setNotification(CardService.newNotification()
          .setText("Error: Missing threadId"))
          .build();
  }

  var accessToken = e.messageMetadata.accessToken;
  if (!accessToken) {
      Logger.log("Error: Missing access token.");
      return CardService.newActionResponseBuilder()
          .setNotification(CardService.newNotification()
          .setText("Error: Missing access token"))
          .build();
  }
  dryRunMode = parseInt(e.parameters.dryRunMode, 10)

  // Set the access token
  GmailApp.setCurrentMessageAccessToken(accessToken);
  var thread = GmailApp.getThreadById(e.parameters.threadId);
  result = removeAttachment(thread, e.parameters.processLabel, e.parameters.processedLabel, dryRunMode)

  return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
      .setText(result))
      .build();
}