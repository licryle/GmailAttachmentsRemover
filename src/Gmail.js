  /**
 * Callback for rendering the card for a specific Gmail message.
 * @param {Object} e The event object.
 * @return {CardService.Card} The card to show to the user.
 */
function onGmailMessage(e) {
  Logger.log(e)

  // Get the ID of the message the user has open.
  var thread = GmailApp.getThreadById(e.gmail.threadId);

  // Get the subject of the email.
  var subject = thread.getFirstMessageSubject();

  var conf = ConfigStore.getInstance()
  var processLabel = conf.getLabelIn()
  var processedLabel = conf.getLabelOut()
  var dryRunMode = conf.getDryRunMode()

  var action = CardService.newAction()
      .setFunctionName('removeAttachmentRemote')
      .setParameters({threadId: thread.getId(), processLabel: processLabel,
                      processedLabel: processedLabel, dryRunMode: dryRunMode.toString()});
 
  var button_one = CardService.newTextButton()
      .setText('Delete Attachments from "' + subject + '"')
      .setOnClickAction(action)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

  var buttonSet = CardService.newButtonSet()
      .addButton(button_one);

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

  dryRunMode = parseInt(e.parameters.dryRunMode, 10)

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

  dryRunMode = parseInt(e.parameters.dryRunMode, 10)

  var thread = GmailApp.getThreadById(e.parameters.threadId);
  result = removeAttachment(thread, e.parameters.processLabel, e.parameters.processedLabel, dryRunMode)

  return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
      .setText(result))
      .build();
}