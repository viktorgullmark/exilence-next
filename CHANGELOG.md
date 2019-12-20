# Changelog
All notable changes to this project will be documented in this file.

## [0.1.3] - XXXX-XX-XX
##### Added
- Added integration with our servers
    - Added synchronization of profiles
    - Added synchronization of snapshots with items
    - Added new notifications related to the server integration
    - Integrated with signalR, with automatic reconnect
##### Fixed
- Fixed a bug where the client would loop the validation if it failed on the login page

## [0.1.2] - 2019-12-18
##### Added
- Added a spinner for when a session is being initiated
##### Changed
- Changed color of a placeholder text in the item table
##### Fixed
- Fixed a bug where the error "No characters in league" would be displayed even though you had characters in the league

## [0.1.1] - 2019-12-17
##### Added
- Added settings page
    - Added setting for toggling low confidence pricing
    - Added setting for controlling the price treshold
- Added automatic retry for validate session at 30 second intervals if it fails
- Added an asterisk to profile name field in profile dialog
##### Changed
- Now displays "N/A" in the links column if the item has no links
- Stash tabs are now required to be selected before saving a profile
- Minor styling improvements to item table
##### Fixed
- Fixed a bug where some uniques were incorrectly priced as 6-links

## [0.1.0] - 2019-12-13
- Initial release
