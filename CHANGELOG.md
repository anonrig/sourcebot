# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased] -

## [0.3.0] - 2016-09-05
### Added
- Added Slack's API interface to communicate with Slack.
- Added the ability to have Private Conversations.
- Added debug option to SlackBot constructor to enable debug mode.

### Changed
- ```conversation.ask``` now supports replyPattern, and callback for failure cases. For more information, follow README.
- ```conversation.askSerial``` now supports replyPattern and callback for failure cases. For more information, follow README.

## [0.2.0] - 2016-09-01
### Added
- Added Conversation methods.

### Changed
- Documentation improved.

## [0.1.2] - 2016-08-31
### Added
- Added disconnect method.
- Add RegExp to listen function.

### Fixed
- Multiple listeners inconsistency solved.
- Multiple typos.

[Unreleased]: https://github.com/sourcebot/sourcebot/compare/0.3.0...HEAD
[0.3.0]: https://github.com/sourcebot/sourcebot/compare/0.2.0...0.3.0
[0.2.0]: https://github.com/sourcebot/sourcebot/compare/0.1.2...0.2.0
[0.1.2]: https://github.com/sourcebot/sourcebot/compare/0.1.1...0.1.2
