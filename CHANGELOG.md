# Changelog
All notable changes to this project will be documented in this file.

## [1.0.0] - NOT RELEASED
#### Added
- Added support for parsing the Unique stash tab
- Added support for parsing the Map tab
- Added a setting for using exalted orbs as main currency
   - Added quicktoggle button directly on the net worth card
   - Changed the currency color to a more neutral tone
- Added support for pricing `Blighted`, `Elder` and `Shaper` maps
- Added support for pricing `Awakened`, `Anomalous` and `Divergent` gems
- Added the ability to cancel an ongoing snapshot
- Added display of map tier in the item table
- Added a sparkline chart to the net worth card
- Added beta labels to new features
- Added tooltips to menu icons
- Added placeholder option to character selection dropdown
- Added option to choose release channels
   - Allows you to change to the beta channel feed
- Added option to choose what should happen when closing the app window
- Added column presets to the item table
- Added minor display improvements to the item table
- Added minor display improvements to the stash tab list
#### Fixed
- Fixed a bug where the icon for some items would sometimes be wrong compared to how it looks in your stash
- Fixed an issue where some legacy maps were priced incorrectly
- Fixed a bug where the app would sometimes get stuck on `Waiting for prices`
- Fixed a bug where the `Waiting for prices` warning would appear when filtering in the custom prices table
- Fixed a bug where the character selection sometimes would not change when league was changed
#### Changed
- Reworked how maps are priced
  - Should now accurately price maps with good confidence
  - Now only prices maps based on the latest generation of maps (e.g Expedition)
- Reworked how uniques are priced
  - Should now correctly identify uniques all the time
- Reworked skill gem pricing
  - Accurate pricing for empower, enhance, enlighten
  - Accurate pricing and identification for all gems
- Changed the underlying data provider
  - Now uses the new https://api.pathofexile.com instead of `/character-window`
- Changed which leagues the pricing league dropdown lists
  - Now lists all leagues that has prices on poe.ninja
- Changed the warning message for `Waiting for prices` to be more descriptive than previously
- Changed the behaviour of the custom prices table
  - Now uses the active pricing league as default
- Changed the default setting for autosnapshotting to false
- Changed the minimum auto snapshotting interval to five minutes, up from two
- Changed background color of the filter total chip
- Changed the default columns for the item table
- Changed how we set the rate limitation on requests
  - Now parses the headers from the response and sets/updates them accordingly
  - Sets a temporary cooldown for snapshots after you have been rate limited
- Changed the way the profile modal behaves
  - Now you should not be able to close it by mistake
- Changed the widget placement on the bulk sell page
- Changed some common translations
- Now only shows the filter total chip when the filter is active
#### Removed
- Removed the helper icon from the pricing league dropdown
- Removed the close button from the initial quickstart tour
- Removed the shortcut to custom prices from the item table
##### Updated
- Updated Material UI (v4 -> v5) with dependencies
- Updated Electron (v12 -> v15) with dependencies
- Updated SignalR (v3 -> v5) with dependencies

## [0.6.0] - 2021-09-19
#### Added
- Added pricing support for item type `Blighted map` (Thanks to AndyHoang)
- Added pricing support for item type `Artifact` (Thanks to AndyHoang)
- Added support for filtering items with RegEx (Thanks to roelsprimont)
- Added a new screen `Bulk sell` (Thanks to Ailuro)
    - Added support for bulk selling items, commonly used in Discord communities
    - Added automatic image generation of the items 
    - Added a video guide with step-by-step description
- Added a manual link with copy button, in case the browser fails to open when logging in
- Added prerequisite info to `README.md` regarding linux protocol handling
#### Fixed
- Fixed a bug where the `Log in` button sometimes would not work properly
- Fixed some typos across the app

## [0.5.5] - 2021-08-13
##### Fixed
- Fixed a bug where you would sometimes receive a 401-error when trying to login 

## [0.5.4] - 2021-08-13
##### Fixed
- Fixed (again) a bug that prevented the application from launching for new users

## [0.5.3] - 2021-08-12
##### Fixed
- Fixed a bug that prevented the application from launching for new users

## [0.5.2] - 2021-08-11
##### Added
- Added build support for MacOS
- Added build support for Linux
##### Fixed
- Fixed a bug that prevented the authorize button from launching the app

## [0.5.1] - 2021-08-02
##### Fixed
- Fixed a bug divination cards was not included in the networth
- Fixed various bugs related to the new Path of Exile: Royale league

## [0.5.0] - 2021-07-23
##### Added
- Added support for Xbox players
- Added support for Playstation players
- Added hour/minute marks to .csv export
- Added app icon to MacOS
- Added tray icon to MacOS
##### Updated
- Reworked the authentication flow to match new requirements
    - Now redirects you through the default browser
    - No longer required to input session id when logging in
##### Fixed
- Fixed a bug where the texts within the app would not translate properly
##### Changed
- Changed the behaviour of the stash tab selection when creating/editing profiles
    - Now persists after selecting a stash tab, which means you can select more tabs quicker
##### Dependencies
- Upgraded Electron to 12.0.7
- Upgraded Node to 16.x
- Upgraded Highcharts to 9.0.0
- Replaced node-sass with dart-sass

## [0.4.8] - 2021-05-03
##### Fixed
- Fixed a bug where the memory would increase too much over time

## [0.4.7] - 2021-05-02
##### Added
- Added a credits section to the help menu
##### Fixed
- Fixed a bug where snapshots would fail to be created
- Fixed a bug where too many errors were sent to Sentry
- Fixed a bug where the price league dropdown for custom prices was not updated when new leagues were introduced
##### Updated
- Updated authorization code in preparation of new OAuth flow

## [0.4.6] - 2021-04-25
##### Fixed
- Fixed a rare bug where the app would not start properly and result in a blank screen
    - Reason was some users having special characters and/or spaces in their windows username

## [0.4.5] - 2021-04-16
##### Added
- Added missing translations
- Improved error logging to Sentry
- Minor visual improvements
##### Fixed
- Fixed a console warning related to mobx arrays
- Fixed a console warning related to missing style element
##### Changed
- Changed size and color of Patreon wordmark to blend in more with theme
##### Updated
- Updated Sentry SDK

## [0.4.4] - 2021-03-30
##### Added
- Added improved loading indicators for net worth page
- Minor visual improvements
##### Fixed
- Fixed a bug where the reset data option did not work properly
- Fixed a bug where the tabs column would take up multiple rows
- Fixed a bug where the income was not reset when snapshots were cleared
##### Changed
- Changed location of Patreon button and updated it with their new wordmark
##### Updated
- Updated Electron (10.1.4 -> 12.0.2) with dependencies

## [0.4.3] - 2021-03-28
##### Added
- Added a setting to toggle hardware acceleration
- Added pricing of invitations
- Added the ability to manually reset storage (IndexedDB)
- Introduced basic error boundaries
    - Should catch most if not all errors and display them to the user, hopefully resolves whitescreen issues
##### Fixed
- Fixed a bug where the values differed between the net worth total and the filter total
- Fixed a bug where you couldn't properly switch accounts, should now correctly reset your previous session
- Fixed a bug where the storage wasnt cleared correctly when doing this manually
- Fixed a bug where setting the interface scaling using the input field didnt work
- Fixed one cause to the app sometimes being stuck on a whitescreen when launching
- Fixed a bug where the active profile would sometimes change when syncing from the server
##### Changed
- Reworked the way OAuth2 works, to match GGGs new requirements on OAuth2 apps
- Improved styling of the notifications to make it more clear when an error appeared

## [0.4.2] - 2020-11-02
##### Added
- Added a loading screen that will be shown before the app is rendered
##### Fixed
- Fixed a bug where snapshotting in group would sometimes crash the app for other group members
- Fixed a bug where the "filter total" value would be inaccurate when in a group
- Fixed a bug where the value for snapshots would sometimes differ between group members

## [0.4.1] - 2020-10-29
##### Changed
- Hotfix for the price fetching interval being incorrectly set

## [0.4.0] - 2020-10-29
##### Added
- Added a new section "prices" in the settings
    - Ability to see all prices stored for each league
    - Ability to override any price with your custom value
    - Added a shortcut to customize prices from the item table
- Added a new support menu in the main window toolbar with helpful links
- Added persistence of position/size for the overlay
- Added reindexing of stash tabs before every snapshot, to support moving tabs around
- Added a status message that shows when prices are being updated
- Added a background process for parsing the Client.txt in preparation for upcoming features
- Added rarity color for legacy uniques
- Added style tweaks to the item table
- Added persistence of selected settings tab
- Added a warning icon to the toolbar that will show when prices has not been retrieved
- Added a popup for displaying important announcements from the development team
    - This will only be used in emergencies that require manual actions from you
##### Fixed
- Fixed a bug where auto snapshotting would sometimes stop working
- Fixed a bug where the installer would sometimes get stuck halfway without any visible errors
- Fixed a bug where the net worth overlay would not update when income was reset
- Fixed a bug where snapshotting would result in a "prices of undefined" error
##### Changed
- Reworked how income is calculated (will be changed further in upcoming releases)
    - Now based on the past hour, or the latest reset timestamp if one exists
- Changed the default page size to 25, up from 10 for all tables
- Changed title on the net worth settings tab (from "Net worth" to "General")
- Disabled the ability to sign out during snapshotting or initiation process
- Reworked the layout of the side menu
- Refactored code in preparation for new upcoming features
##### Updated
- Updated the main framework (Electron) to the latest version
- Updated React and related dependencies to the latest version
- Updated most other dependencies we use to the latest version

## [0.3.14] - 2020-10-23
##### Added
- Added tooltips to the icon buttons in the table toolbar
##### Fixed
- Fixed a bug where the app would not open correctly from tray when relaunching it
- Fixed a bug where some settings had a trailing NaN value
##### Updated
- Updated libraries for the table component (react-table)

## [0.3.13] - 2020-10-22
##### Fixed
- Fixed a bug where the auto updater stopped working

## [0.3.12] - 2020-10-22
##### Fixed
- Fixed a bug where the app would not close
- Fixed a bug where the app would be stuck on white screen when launched a second time

## [0.3.11] - 2020-10-22
##### Added
- Added a link to view the price history on poe.ninja for each item
- Added a reset button to the income widget
- Added support for resizing columns in the item table
- Added support for toggling which columns are visible in the item table
- Added support for minimizing the app to the system tray
    - Will be put in tray when you close the app
##### Changed
- Reworked the entire table structure and should now be more performant
- Reworked how income is calculated
    - Now calculates over every hour since the session started, instead of only the past hour
- Minor style tweaks

## [0.3.10] - 2020-09-19
##### Changed
- Minor style tweaks
##### Removed
- Removed seed as a item category

## [0.3.9] - 2020-07-29
##### Added
- Added support for pricing seeds
- Added a new column "Item level" in the item table
- Added a warning text if more than 10 tabs are selected in the profile
- Added translations for "no_characters" string
##### Changed
- Changed how the price thresholds work (thanks to kryo4096)
    - The total threshold now overrides the individual threshold, not the other way around
    - Note that this may affect your net worth substantially depending on settings
- Changed the behavior of the menu drawers, to reduce client lag
- Changed the visual display of the expired session error on the login screen
##### Fixed
- Fixed a bug where items with no value would be listed, e.g common/rare items

## [0.3.8] - 2020-06-17
##### Added
- Added the support button to the login page
- Added an in app modal which explains how to find your session Id, instead of redirecting to the Discord

## [0.3.7] - 2020-06-16
##### Added
- Added a setting for selecting the cutoff for stacks of items, similar to the price threshold but for the total item count
    - Maximum value for the setting is capped at 5000 c
- Added a fallback to 'Standard' league for profiles where the pricing league was outdated
    - Previously we didnt update these profiles, so they would fail when snapshotting
- Added the ability to go to the first page in the item table
- Added the ability to go to the last page in the item table
- Added missing translations
##### Changed
- Reduced the minimum width of the main window to 800, down from 1000px
- Changed the session id link to redirect to our Discord instead of the old wiki page
- Minor improvements to the layout of the settings page
##### Fixed
- Fixed a bug where the app would crash if you pressed enter while having the search bar in focus (thanks to romankrru)
- Fixed a bug where the page size for the item table would not persist through restarts
##### Removed
- Removed some leftover console logs

## [0.3.6] - 2020-04-11
##### Added
- Added a label which shows the current selection net worth value (e.g after searching/filtering) (thanks to kryo4096)
- Added the ability to set a custom price threshold interval between 1c and 100c (thanks to kryo4096)
- Added the ability to search for rarities/categories in the search bar (thanks to kryo4096)
    - You can now typ 'currency' to list only currency for example
##### Changed
- Changed position of the "Reset zoom" button in the charts
- Disable group actions while snapshotting (thanks to PezeM)
##### Fixed
- Fixed a bug where the loading indicator would not appear when validating a session
- Fixed a bug where the total net worth would sometimes differ slightly from the item table total value
##### Removed
- Removed the unique- and map stash tabs from the stash tab dropdown (thanks to M-Schiller)

## [0.3.5] - 2020-03-29
##### Added
- Added the ability to filter stash tabs in the tab breakdown chart
##### Fixed
- Fixed a performance issue introduced with the last update
    - We now limit the snapshots to a count of 50 in the tab breakdown chart

## [0.3.4] - 2020-03-28
##### Added
- Added a new chart for breakdown per tab
- Added a chart toolbox to the net worth chart, for selecting different timespans
- Minor chart improvements

## [0.3.3] - 2020-03-27
##### Added
- Added a filter section for the item table
    - Added a multiselect which lets you filter based on stash tabs
- Added a new column that displays the tab names an item exists in (solo only)
- Added a search icon to the search field
- Minor style tweaks across the app
##### Changed
- Reworked the stash tab dropdown entirely in the profile dialog
    - Better positioning of the popup
    - Ability to clear all in the selection
    - Ability to remove individual stash tabs without opening the popup
- Reduced the padding on rows in the item table, to fit more items per page
- Changed position of the pricing league dropdown in the profile dialog
##### Fixed
- Fixed a bug where some jewels and jewellry without value were listed in the item table
- Fixed a bug where the support button would be placed on top of the scrollbar

## [0.3.2] - 2020-03-24
##### Added
- Added support for pricing delirium orbs
- Added support for pricing vials
- Added a small cross for clearing the search field in the item table
##### Changed
- Changed the default setting for auto snapshotting
    - Now enabled by default
##### Fixed
- Fixed a bug where the overlay sometimes would not stay on top of the game

## [0.3.1] - 2020-03-20
##### Fixed
- Fixed a bug with the new character selection that would interrupt the snapshot chain
- Fixed a missing translation for the new error handling

## [0.3.0] - 2020-03-20
##### Added
- Added a game overlay for the net worth component
- Added optional character selection to profiles
    - Added an option to include equipment in profiles
    - Added an option to include inventory in profiles
- Added fallback for error messages in case message is missing
- Added separate colors in the net worth chart for each group member
- Added redirection to login when the current session has expired
##### Fixed
- Fixed a bug where the status messages would sometimes display an incorrect stash tab count

## [0.2.12] - 2020-03-17
##### Added
- Added support for storing up to 1000 snapshots, up from 100
##### Fixed
- Fixed a bug where normal and magic maps were priced as red maps

## [0.2.11] - 2020-03-12
##### Added
- Added the ability to zoom in the chart
    - Select a portion of the chart with the mouse to zoom in
- Added a support tab that redirects to Discord
- Added the ability to show/hide the chart
- Added the ability to show/hide the item table
##### Changed
- Changed position of the Patreon logo, to allow for more space
- No longer persists snapshots on server (temporarily) to decrease load
##### Fixed
- Fixed a bug where auto snapshotting would stop working
- Fixed a bug where magic maps weren't priced

## [0.2.10] - 2019-02-13
##### Added
- Added support for pricing fragments
- Added support for pricing maps (outside of the map tab)
- Added support for pricing other common items

## [0.2.9] - 2019-02-13
##### Added
- Added support for pricing watchstones
- Added support for pricing incubators
##### Changed
- Improved the retry policy for SignalR
##### Fixed
- Fixed a bug where corrupted unique items were not priced
- Fixed a bug where users sometimes could not sign in from multiple locations

## [0.2.8] - 2019-02-11
##### Added
- Added detailed status messages to the toolbar
- Minor style tweaks
##### Changed
- Changed the lower limit of the auto snapshot interval to 2 minutes
##### Fixed
- Fixed a bug where uniques with quality were not priced correctly
- Fixed a bug where some uniques with links were not priced correctly
- Fixed a bug where the snapshot button would be disabled after relogging

## [0.2.7] - 2020-02-04
##### Added
- Added the ability to trigger manual snapshots while auto snapshotting is turned on
- Minor style tweaks
- Minor client optimizations
##### Changed
- Changed the input field styles in the profile dialog
##### Fixed
- Fixed a bug where failed stash tab requests would trigger an infinite loop for init session
- Fixed a bug where the stash tab dropdown position sometimes would change when selecting a stash tab
- Fixed a bug where part of the scrollbar was hidden beneath the toolbar
- Fixed a bug where the table row borders would sometimes be distorted

## [0.2.6] - 2020-02-02
##### Added
- Added support for private leagues
- Added a introduction tour for new users that will be displayed once
- Added styled tooltips when hovering icon buttons
- Added persistance of item table sort order
##### Changed
- Changed default sort order in item table
    - The total column is now the default (descending)
- Changed retry intervals for initiating/validating sessions
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
- Changed how the price threshold setting works
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
    - Added setting for controlling the price threshold
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
