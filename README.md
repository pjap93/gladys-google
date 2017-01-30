Gladys-google
=======================

This module allows you to connect to Google API.


## Setup

- Visit [Google Developpers Console](https://console.developers.google.com/project)
- Click **CREATE PROJECT**
- Enter a *Project Name* (for example "Gladys") , then click **CREATE**
- Then select *APIs & auth* from the sidebar and click on *Credentials* tab
- Click **CREATE NEW CLIENT ID** button :
 - **Application Type**: Other
 - **Name** : Gladys for example
- Copy past the client ID and the client secret

- Go to Gladys, and install the google module
- Go to parameters, then tabs "Parameters", then create 3 Params :
  - **GOOGLE_API_CLIENT_ID** : The client ID you copy pasted before
  - **GOOGLE_API_CLIENT_SECRET** : Ths client secret
  - **GOOGLE_API_REDIRECT_URL**: urn:ietf:wg:oauth:2.0:oob
- Then reboot Gladys

- Create a script in Gladys, with the following code :

```javascript
gladys.modules.google.getRedirectUrl().then(console.log).catch(console.log);
```

- Then, go to Gladys logs on your Raspberry Pi (Type : `pm2 logs gladys`), you should see an 
url starting with "https://accounts.google.com/o/oauth2/auth?access_type=offline". 
- Copy paste this URL in your browser, and connect to your Google account. It should give you a code. Copy paste this code.
- In Gladys, go to the dashboard, and create a script with the following code :

```javascript
gladys.modules.google.authenticate('YOUR CODE', {id: YOUR_USER_ID});
```

(to find your user ID, go to "Parameters" => "My Account" in Gladys)

- Then, to simply do a first synchronization, execute the following script :

```javascript
gladys.modules.google.calendar.sync().then(console.log).catch(console.log);
```

You should see in Gladys logs all calendars synced.

Congrats !

## Usage

I recommend to sync your calendars a first time with either a script, or by clicking on the "configuration" button
(Clicking on "configuration" simply start a sync).

Then, you can create a cron schedule telling "Every 30 minutes" => sync in Gladys.

- First, create an alarm in "Alarms". Create a cron rule with the following rule : "0 0,30 * * * *".
- Then create a scenario with this alarm selected, and put in action "Sync calendars".

If the action does not exist, go to parameters and update Gladys data.