/**
 * Callback for rendering the homepage card.
 * @return {CardService.Card} The card to show to the user.
 */
function onHomepage(e) {  // Get an access token scoped to the current message and use it for GmailApp
  // calls.
  Logger.log(e)
  var accessToken = e.gmail.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);

  // Get the ID of the message the user has open.
  var thread = GmailApp.getThreadById(e.gmail.threadId);

  var ConfigStore = ConfigStore()
  var processLabel = ConfigStore.getLabelIn()
  var processedLabel = ConfigStore.getLabelOut()
  var dryRunMode = ConfigStore.getDryRunMode()

  var action = CardService.newAction()
      .setFunctionName('removeAttachmentsRemote')
      .setParameters({threadId: thread.getId(), processLabel: processLabel,
                      processedLabel: processedLabel, dryRunMode: dryRunMode.toString(),
                      accessToken: accessToken});
 
  var button = CardService.newTextButton()
      .setText('BatchRemove"' + subject + '"')
      .setOnClickAction(action)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

  var buttonSet = CardService.newButtonSet()
      .addButton(button);

  return createCard(CardService.newCardSection().addWidget(buttonSet));
}

function createCard(pageSection) {
  var peekHeader = CardService.newCardHeader()
    .setTitle('DeleteAttachments')
    .setImageUrl('https://www.gstatic.com/images/icons/material/system/1x/pets_black_48dp.png')
    .setSubtitle('FutureSubTitle');

  // Create a footer to be shown at the bottom.
  var footer = CardService.newFixedFooter()
      .setPrimaryButton(CardService.newTextButton()
          .setText('Cyrille Berliat')
          .setOpenLink(CardService.newOpenLink()
              .setUrl('https://cyrille.berliat.fr')));

  var card = CardService.newCardBuilder()
      .addSection(pageSection)
      //.addSection(CardService.newCardSection().addWidget(buildCardWithDropdown(Constants.DRYRUN_MODE)))
      .setPeekCardHeader(peekHeader)
      .setFixedFooter(footer);

  return card.build();
}

function buildCardWithDropdown(config) {
    // Define the options for the dropdown
  let dropdown = CardService.newSelectionInput()
    .setTitle("Choose an option")
    .setFieldName("dropdownField")
    .setOnChangeAction(
      CardService.newAction().setFunctionName('onDryRunModeChange')
    )
    .setType(CardService.SelectionInputType.DROPDOWN);

    var options = []
    Object.entries(config).forEach(function([key, value]) {
      dropdown.addMultiSelectItem(key, value.toString(), false,
            'https://www.gstatic.com/images/branding/product/2x/contacts_48dp.png',
            'Contact one description',);
    });

    // Create a dropdown widget
    return dropdown
}

function onDryRunModeChange(e) {
  Logger.log(e)
  ConfigStore.getInstance().setDryRunMode(e.value)
}