# f1-telemetry-cli [![CircleCI](https://circleci.com/gh/chaseconey/f1-telemetry-cli.svg?style=svg)](https://circleci.com/gh/chaseconey/f1-telemetry-cli)

A simple CLI for tracking and processing F1 game UDP data (currently supports F1 2020).

## Overview

This CLI uses the in-game UDP packet stream to parse and process the race data as it comes in. This data is then persisted to a flat json file on interval for later retrieval/processing. There are many other solutions out there that accomplish this in different ways. The approach of this package was to try and be very selective about what data is stored to try and keep the process as lightweight as possible. If you are looking to collect as much data as possible for more powerful post-processing capabilities, you might want to check out [this project](https://pypi.org/project/f1-2020-telemetry/).

### Tracked Data

Here is a high level idea of the kinds of data that this CLI records:

- Session ID
- Driver data such as racing number and team
- Snapshot lap data for tracking fastest lap, fastest sectors, and driver status
- End of race classification data for all drivers such as fastest lap time, points, pit stops, penalties (basically everything you see on the final screen after a race/quali)
- Custom data such as best lap tire (this is not provided in lap or classification data)

For a full example of a completed race, check out [the stub here](stubs/final-race.json).

## Installation

```
npm install -g f1-telemetry-cli
```

## Usage

```
f1-telemetry help
f1-telemetry [command]

Commands:
  f1-telemetry record          Start recording F1 2020 sessions
  f1-telemetry process <file>  Process session data for specific session

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

## Contributing

TODO
