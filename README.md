Exilence Next
[![Become a Patreon](https://img.shields.io/badge/patreon-%F0%9F%8E%AF-orange.svg)](https://www.patreon.com/exilence)
===
Exilence Next is a desktop application that helps you calculate how valuable your character, inventory and stash tabs are. The data is broken down and summarized over time, to see how much you earn on an hourly basis. To add to this, you can also group up with friends directly within the app to see your combined net worth.

The app is a successor to our old application named Exilence, previously known as ExileParty.

![Preview image](https://i.imgur.com/IfyINev.png)

## Contents

- [Download](#download)
- [Changelog](https://github.com/viktorgullmark/exilence-next/blob/master/CHANGELOG.md)
- [Platform](#platform)
- [Contributing with development](#contributing-with-development)
- [Contact us](#contact-us)
- [Supporting us](#supporting-us)
- [Acknowledgements](#acknowledgements)
- [License](#license)

## Download

Download the latest release at https://github.com/viktorgullmark/exilence-next/releases/latest

## Platform

Currently runs with:

- Electron 15.1.0
- React 17.0.1
- mobx 6.0.1
- .NET Core 3.1
- **node 16.x**
- **npm 7.x**

## Contributing with development

Before submitting a PR, please see our [contributing guidelines](https://github.com/viktorgullmark/exilence-next/blob/master/CONTRIBUTING.md).

---
**Prerequisite for building LINUX**

You will need to manually set protocol handling. Follow steps below:

1. Create `~/.local/share/applications/ExilenceNext.desktop` with:

```bash
[Desktop Entry]
Name=Exilence Next
Exec=<ABSOLUTE PATH TO ExilenceNext>/ExilenceNextApp/dist/<Exilence-Next-X.Y.Z.AppImage> %u
Icon=<ABSOLUTE PATH TO ExilenceNext>/ExilenceNextApp/public/icon.ico
Terminal=false
Type=Application
MimeType=x-scheme-handler/exilence;
```

2. Run:
- `update-mime-database ~/.local/share/mime`
- `update-desktop-database ~/.local/share/applications`
---

Run the following to get started with the client:
```
npm install
npm run smoke-build-linux (build for linux)
npm run smoke-build-mac (build for macOS)
npm run smoke-build-win (build for windows)
```
These create the AppImage the .desktop file points to.

NOTE: Running a build using node versions newer than v14 seem to fail on MacOS and Linux. For development on these platforms, it's recommended to use v14.16.1 (Latest LTS).

Other build options:
```
npm start (to serve the project)
npm run build (optional, to build the installer for production) 
---
npm run release (optional, to build the installer for production and release)
```

## Contact us

Communicate with us at our Discord https://discord.gg/yxuBrPY

Report bugs at https://github.com/viktorgullmark/exilence-next/issues

## Supporting us

If you feel like chiming in with something, here's our Patreon: https://www.patreon.com/exilence

## Acknowledgements

- https://poe.ninja for providing a great API, which lets us calculate net worth of players

## License

This work is licensed under the Creative Commons Attribution-NonCommercial 3.0 Unported License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/3.0/ or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
