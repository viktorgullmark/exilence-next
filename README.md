Exilence Next
[![Github All Releases](https://img.shields.io/github/downloads/viktorgullmark/exilence-next/total.svg)](https://github.com/viktorgullmark/exilence/releases)
[![Become a Patreon](https://img.shields.io/badge/patreon-%F0%9F%8E%AF-orange.svg)](https://www.patreon.com/exilence)
===
Complete rewrite of Exilence.

Path of Exile tool used to track net worth, gear, maps and more of you and your party. Formerly known as ExileParty.

## Contents

- [Download](#download)
- [Changelog](https://github.com/viktorgullmark/exilence/blob/master/CHANGELOG.md)
- [Important](#important)
- [Supporting us](#supporting-us)
- [Help with development](#help-with-development)
- [Contact us](#contact-us)
- [Acknowledgements](#acknowledgements)

<!--TODO-->
<!--- [How to install](#how-to-install)-->
<!--- [Platform](#platform)-->

## Download

Download the latest release at https://github.com/viktorgullmark/exilence-next/releases/latest

<!--## How to install-->
<!--TODO-->

## Important

We do not own a code-signing certificate for the application, which means you will receive a warning the first time you launch the .exe. To get around this, just press "More info" -> "Run anyway" when it pops up, and the warning won't be displayed for you again.

## Supporting us

We want to deliver the best functionality and experience for you that we possibly can. We always strive to achieve this, both by development directly and with the help of powerful servers. Servers cost money, and your support helps us maintain these servers in the future as well as speed up the development process. 

If you feel like chiming in with something, here's our Patreon: https://www.patreon.com/exilence

<!--## Platform-->
<!--TODO-->

## Help with development

If you want to help with development we gladly accept pull-requests. To set up the project, install the latest angular-cli and node version.

```
npm install -g @angular/cli
npm install
npm run start (to serve the project)
npm run electron:windows (optional, to build the installer for production)
```

To run the API you will need a local Redis- and MongoDB-server.

If you're interested in helping with development, contact us directly on discord: https://discord.gg/yxuBrPY and we'll help setting it up.

## Contact us

Communicate with us at our Discord https://discord.gg/yxuBrPY

Report bugs at https://github.com/viktorgullmark/exilence-next/issues

## Acknowledgements

- https://poe.ninja for providing a great API, which lets us calculate net worth of players
- https://poe.watch for providing in-depth pricing data for items
- https://github.com/klayveR for providing a great log-monitor to track the Client.txt
- GGG for adding additional endpoints for us and for creating a great game!
