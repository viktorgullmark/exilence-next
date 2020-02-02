# Changelog
All notable changes to this project will be documented in this file.

## [0.2.6] - 2020-XX-XX
##### Added
- Added support for private leagues
- Added a introduction tour for new users that will be displayed once
- Added styled tooltips when hovering icon buttons
##### Fixed
- Fixed a bug where the label displaying the time since snapshot wasn't updating properly
##### Updated
- Updated Electron framework to version 7

## [0.2.5] - 2020-01-29
##### Changed
- Changed the position and behaviour of the scrollbar
##### Fixed
- Fixed a bug where the app would crash when switching profiles
- Fixed a bug where the app would crash when removing all snapshots

## [0.2.4] - 2020-01-28
##### Added
- Added a setting for scaling the user interface
- Added a new card for income (gain per hour)
    - Currently based on the past 1 hour, but will be configurable later on
- Added a label to the net worth card that displays the diff for the last two snapshots
- Added a label to the snapshot card that displays the time since the last snapshot occured
- Added group support for the chart
    - Now displays one line per player
- Added styling for tooltips
- Now displays a text when an update is ready
    - Ability to update manually from within the app
##### Changed
- Changed the look and feel of the cards in the top of the net worth page
- Changed order of the sections in the toolbar
- Changed how the scroll behaves on the net worth page, to allow for more control
- Changed how the price treshold setting works
    - It now updates the actual value on the snapshot, which means you have to wait for a new snapshot for changes
##### Fixed
- Fixed a bug where the font was not properly set for some users

## [0.2.3] - 2020-01-26
##### Removed
- Removed a forgotten console log

## [0.2.2] - 2020-01-26
##### Added
- Added a new chart widget (replaces the smaller one)
- Adding spacing to the "Total" column in the item table
##### Changed
- Changed default state for navigation menu
- Changed position for Discord and Patreon logos, to be more visible
##### Removed
- Removed the smaller chart widget
##### Fixed
- Fixed a bug where some users would not be connected to our servers properly
    - Caused by multiple connections on the same client
- Fixed a bug where redirects in the app would only work the first time
- Fixed a bug where dropdown menus would linger after signing out

## [0.2.1] - 2020-01-23
##### Added
- Added setting for auto snapshotting with custom intervals
- Added a spinner for when new prices are being fetched
##### Changed
- Changed how prices are calculated for currency items
    - This fixes the overpricing we previously had with certain items
    - They are now a direct reflection of the 'Buy' price at http://poe.ninja instead of the estimated value
    - They will only be included if there are at least 10 items for sale (unless low confidence is turned on)
##### Fixed
- Fixed a bug where low confidence pricing was enabled even though the setting was turned off
- Fixed a bug where users would get force-kicked from the server if trying to login twice
- Fixed a bug where multiple sessions could be initiated at the same time
- Fixed a bug where users sometimes would end up with no active profile after removal

## [0.2.0] - 2020-01-22
##### Added
- Added group system
    - Added the ability to create/join/leave a group
    - Added optional password protection for groups
    - Added the ability to select multiple players in the group
- Added OAuth2 authentication
    - Ability to confirm that you are the owner of the account
    - Secure data persistance
    - Support for multiple accounts
- Added integration with our servers
    - Added synchronization of profiles
    - Added synchronization of snapshots with items
    - Added new notifications related to the server integration
    - Added indicator that shows if you're disconnected from our servers
    - Communication via websockets, with automatic reconnect
        - Using the messagepack protocol (binary)
- Added a basic chart that displays snapshot history
- Added migrations to client
- Added description to notifications
- Added link to Patreon page
##### Changed
- Reduced spacing in item table for a more minimalistic look
- Replaced the warning text in the item table with an icon
##### Removed
- Removed account name field at login screen (fetched via OAuth2 instead)
##### Fixed
- Fixed a bug where the client would loop the validation if it failed on the login page
- Fixed a bug where the relative time on notifications was not displayed correctly
- Fixed a bug where the redirection logic was not working properly in some cases
- Fixed a bug where the login container would get pushed if the menu was previously open
- Fixed a potential memory leak where we stored displayed alerts forever (in a session)

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
