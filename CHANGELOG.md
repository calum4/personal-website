# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0]

### Added

- Terminal style website
- Default commands including whoami, github, linkedin, email, clear, reset, help
- [Heavily obfuscated email to avoid email scrapers](https://github.com/calum4/personal-website/commit/fff810ac851b2622fe8617e3c4942e86ba5f4d46)
- Commands can be customised using `config.json`, see [`config.example.json`](config.example.json)
- Custom commands defined in the same config
- Command completion with tab
- Command history with up/down arrow keys
- Deployable with Docker
