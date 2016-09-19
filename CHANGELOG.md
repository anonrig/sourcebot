# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased] -

## [0.4.0] - 2016-09-19
### Added
- Added tests for stability.
- Added Travis CI for tests.
- Added Coveralls.io integration for code coverage statistics.

### Fixed
- Fixed startConversation not replying to anybody except the first responder bug.
- Fixed documentation.

### Changed
- Slack WebSocket now throws an error if keys/opts are invalid/missing.
- Slack WebSocket constructor won't connect automatically unless you call ```connect()``` function.


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

[Unreleased]: https://github.com/sourcebot/sourcebot/compare/0.4.0...HEAD
[0.4.0]: https://github.com/sourcebot/sourcebot/compare/0.3.0...0.4.0
[0.3.0]: https://github.com/sourcebot/sourcebot/compare/0.2.0...0.3.0
[0.2.0]: https://github.com/sourcebot/sourcebot/compare/0.1.2...0.2.0
[0.1.2]: https://github.com/sourcebot/sourcebot/compare/0.1.1...0.1.2
