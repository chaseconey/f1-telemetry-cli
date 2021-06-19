# f1-telemetry-cli
![CircleCI](https://img.shields.io/circleci/build/github/chaseconey/f1-telemetry-cli)
![npm (tag)](https://img.shields.io/npm/v/f1-telemetry-cli/latest)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


A simple CLI for tracking and processing F1 game UDP data (currently supports F1 2020).

Companion CLI for the [F1 Racing Portal](https://github.com/chaseconey/frl).

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
  f1-telemetry session         Get live session data

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

### Recorder

```
f1-telemetry record

Start recording F1 2020 sessions

Options:
      --version          Show version number                           [boolean]
      --help             Show help                                     [boolean]
  -p, --path             Path to write file to                    [default: "."]
      --write-frequency  Time in ms to wait between flushes to file
                                                                 [default: 2500]
      --prefix           Name to prefix written file with          [default: ""]
      --port             UDP port to listen on                  [default: 20777]
  -f, --forward-address  IP Address to forward UDP packet stream to
```

This command will record the active UDP data stream from the game and save the important bits and bobs in a very lightweight json file. This can be extremely useful for collecting data for things like league races.

### Processor

```
f1-telemetry process <file>

Process session data for specific session

Options:
      --version  Show version number                                   [boolean]
      --help     Show help                                             [boolean]
  -p, --path     Path to write file to                            [default: "."]
  -n, --name     Name of the processed file               [default: "processed"]
```

This command will further process the raw json data and put it into a slightly more usable format.

This command also augments the original data with some calculated data that could be useful such as:

- **Driver Fastest Lap Delta** - the difference between each driver's fastest lap and the race's fastest lap
- **Driver Fastest Lap Sector Deltas** - the difference between each driver's fastest sector and the session's fastest lap's fastest sector (not the overall fastest sector)

It will then organize this data sorted by the finishing race position and keyed by the driver's racing number.

For a full example of a completed race, check out [the stub here](stubs/final-race.json).

### Session

![](/img/session.png)

```
f1-telemetry session

Get live session data

Options:
      --version       Show version number                              [boolean]
      --help          Show help                                        [boolean]
      --port          UDP port to listen on                     [default: 20777]
      --events-shown  Number of events to show in events table      [default: 5]
  -m, --map-file      Path to csv driver map (racing number, driver name)
                                                                 [default: null]
```

This command can be used to stream session information to your console. This is a great tool for getting at-a-glance information as a broadcaster or spectator.

To correlate real-time events to drivers, you can pass a path to a csv with driver racing numbers to names like so:

```
2,Rawrocopter
21,Redbaron
```

Now everytime an event comes in for racing number `2`, `Rawrocopter` will be shown instead.

