/**
 * Callback for rendering the homepage card.
 * @return {CardService.Card} The card to show to the user.
 */
function onHomepage(e) {
  Logger.log(e)

  var conf = ConfigStore.getInstance()
  var processLabel = conf.getLabelIn()
  var processedLabel = conf.getLabelOut()
  var dryRunMode = conf.getDryRunMode()
  var action = CardService.newAction()
      .setFunctionName('removeAttachmentsRemote')
      .setParameters({processLabel: processLabel,
                      processedLabel: processedLabel, dryRunMode: dryRunMode.toString()});
 
  var button_all = CardService.newTextButton()
      .setText('BatchRemove from ' + processLabel)
      .setOnClickAction(action)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

  var buttonSet = CardService.newButtonSet()
      .addButton(button_all);

  // Assemble the widgets and return the card.
  var section = CardService.newCardSection()
      .addWidget(buttonSet);

  return createCard(section);
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