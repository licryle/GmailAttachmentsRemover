# GMail Attachments Remover
## Intro
GMail Attachments Remover is a small Google Apps Script that will essentially remove the attachment from any e-mail you select in Gmail -- hence saving precious space in a 15Go limited world.
More in details, removing attachments is not an existing feature in the email protocole, however this script will create its best possible replica, then Trash the original email, living in place an email with attachments of each 0Kb.

See for yourself:
__ToDo: Insert before-after picture__

## How to?
1. Follow the instructions below
2. Run the script once, it will create the Labels ___TooBigEmails__ and ___FormerBigEmails__
3. Add the threads you want to clean to ___TooBigEmails__
4. Run the script, it will "remove" the attachments, add the ___FormerBigEmails__ label on the new email, and place the old email of the email to Trash
5. Check everything is Ok with the copies in ___FormerBigEmails__
6. (Optional) Empty trash

## Limitations
- If too many emails, the script can timeout. A simple re-run will help. Note that technically, it could create one too many copies of a cleaned email if it crashes after the copy and before the Trashing.
- UI isn't pretty in the Gmail Add-on
- The GMail Add-on __cannot__ reload the GMail tab, so unfortunately you'll have to reload manually to see the effects once the script finished running.

# Installation
## Pre-requisites
### Install clasm

First install npm, on Debian based with
`sudo apt get npm`
Then clasp:
`npm install -g @google/clasp`

### Login into clasp

`clasp login`
If you use a proxy:
`HTTP_PROXY=xxxx HTTPS_PROXY=xxxx clasp login`

### Enable Clasp to push to script via API:

- Go to https://script.google.com/home/usersettings
- Turn Google Apps Scripts API "on"

## Actual installation

```
git clone licryle/GmailAttachmentsRemover
cd GmailAttachmentsRemover/

clasp create --title GmailAttachmentsRemover --type Standalone --rootDir .
```
### Prepare the GCP Project

To be able run the script, you need to create a new Google Cloud (GCP) project.

> Note that for the rest of the instructions, I will assume you stick to naming thr GCP Project __GmailAttachmentsRemover__.
> 
> Most clickable links will be broken otherwise. Only change the name if you know what you're doing.

- [Create a GCP project](https://console.cloud.google.com/projectcreate) -- [Full Doc](https://cloud.google.com/resource-manager/docs/creating-managing-projects) - Use __GmailAttachmentsRemover__ as name
- Copy the project id from the [Project details](https://console.cloud.google.com/iam-admin/settings?project=gmailattachmentsremover).
- `clasp setting projectId xxxx`

#### Consent Screen: necessary to execute script

- Configure a [Consent Screen in __Branding__](https://console.cloud.google.com/auth/branding?project=gmailattachmentsremover)
-- App Name: __GmailAttachmentsRemover__
-- Email: input your email
-- Audience: Internal if you're in a workspace, External otherwise

#### Credentials: allow code to be executed from terminal

- Create a [credentials / OAuth client ID in __Clients__](https://console.cloud.google.com/auth/clients?project=gmailattachmentsremover)
-- Application Type: Desktop App
-- Name: __MyDevStation__ or whatever you wish to name your computer's credentials
-- Click __CREATE__
-- Then __DOWNLOAD JSON__ to the ./ directory
-- Rename the file to __creds.json__

#### Audience: Allow yourself to test

- Add yourself as a test user in [__Audience__](https://console.cloud.google.com/auth/audience?project=gmailattachmentsremover)
-- Under __Test users__, __Add users__
-- Add your gmail on which you want to run the script
-- Save
- Verify your credentials and everything works with the command
- `clasp login --creds creds.json`
- It will take to through the Google Authentication consent flow in the UI; make sure to click __Continue__, which is not the attractive/blue/highlighted option by default, since it's a "dangerous" program under development (of which, technically, you act as the developer).

#### App APIs: Enable to actually do something to your emails

`clasp apis enable gmail`

#### Deploy as Workspace Add-on
This will ensure you can easily remove attachments from an EMail directly from the UI of Gmail, as well as trigger the whole clean-up.
- `clasp open`
- Click on the __dropdown arrow__ next to the __Deploy__ button
- Click __Test deployments__
- Under __Google Workspace Add-on__, you should see __Application(s)__
- Click __Install__ next to __Gmail__

Open or reload your __Gmail__ browser tab, and should should see the icon on the Right hand bar.

## Run the program

### Scripts UI
At this stage, the program should run, either in the UI:
- `clasp open`
- Select __main.gs__
- Select function __main__
- Click __Run__

### In terminal
`clasp run main`

### In Gmail
On the right hand bar of Add ons -- if you installed the add-on -- will appear.