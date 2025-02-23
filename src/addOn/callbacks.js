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
