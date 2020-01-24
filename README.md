# gun-nodejs-bugs
Gun has issues when running from NodeJS. This is a testing rig for that.

## Plan

 - use the latest Gun code (so, always set-up from `master`)
 - have a way of doing specific tests with specific settings

## Running the tests

```
$ docker-compose up -d && docker-compose exec gun bats /opt/gun-nodejs-bugs/tests/
```

## Running stuff manually

```
$ docker-compose exec gun /bin/bash
root@df39511e59ec:/opt/gun# node /opt/gun-nodejs-bugs/
gun-nodejs-bugs

Usage:
  gun-nodejs-bugs [options] <command> [positionals]

Commands:
  gun-nodejs-bugs get <key> [subkey]        View a Gun node.
  gun-nodejs-bugs put <key> <subkey>        Update a Gun node.
  <text>

Options:
  --version            Show version number                             [boolean]
  -d, --debug          Enable debug output             [boolean] [default: true]
  -P, --peer           Upstream peer
                                 [string] [default: "http://localhost:8765/gun"]
  -L, --local-storage  Should localStorage be used    [boolean] [default: false]
  -R, --radisk         Should radisk be used          [boolean] [default: false]
  -A, --axe            Should AXE be used             [boolean] [default: false]
  --help               Show help                                       [boolean]
```
