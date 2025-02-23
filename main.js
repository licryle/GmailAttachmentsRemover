function main() {
  var processLabel = '_TooBigEmails';
  var processedLabel = '_FormerBigEmails';
  var dryRunMode = Constants.DRYRUN_MODE.DRYRUN_NONE;

  getOrCreateLabelIdByName(processLabel);
  getOrCreateLabelIdByName(processedLabel);

  removeAttachments(processLabel, processedLabel, dryRunMode)
}