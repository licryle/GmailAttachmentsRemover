function getOrCreateLabelIdByName(label) {
  var label_id = getLabelIdByName(label)

  if (label_id != null) return label_id

  return createLabel(label);
}

function getLabelIdByName(labelName) {
  var userId = "me"

  var labels = Gmail.Users.Labels.list(userId).labels;
  var label = labels.find(l => l.name === labelName);
  return label ? label.id : null; // Return label ID or null if not found
}

function createLabel(labelName) {
  var label = GmailApp.createLabel(labelName);
  Logger.log("Label created: %s", label.getName());
  return label.id;
}

function combineLabels(messageData, removeLabel, addLabel) {
    var labelIds = messageData.labelIds; // Preserve labels
    if (labelIds == undefined) labelIds = []
  
    // Step 4: Apply the original labels to the newly inserted message. except SENT
    var excludedLabels = ["SENT", getLabelIdByName(removeLabel), null]; // Labels to exclude
    var extraLabels = [getLabelIdByName(addLabel)]; // Labels to always add

    var validLabels = labelIds
      .concat(extraLabels) // Add extra labels
      .filter(label => !excludedLabels.includes(label)) // Remove invalid labels
      .filter((label, index, self) => self.indexOf(label) === index); // Remove duplicates
    
    return validLabels
}