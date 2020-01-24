# gun-nodejs-bugs

[Gun](https://github.com/amark/gun/) has issues when running from NodeJS. This is a testing rig for that.

## Plan

 - [x] use the latest Gun code (so, always set-up from `master`)
 - [x] have a way of doing specific tests with specific settings
 - [x] have a way of selecting specific NodeJS versions
 
## NodeJS versions

By default, `node:latest` is used as the base image. You can select which version of the `node` image you want by setting the `NODEVER` build arg to any of the [tags supported by the `node` image](https://hub.docker.com/_/node/). For example:

```
docker-compose build --build-arg NODEVER=10`
```

...will build the image based on `node:10` image. Be advised, only Debian `stretch`-based tags have been tested (but others should work)!

## Running the tests

```
$ docker-compose up -d && docker-compose exec gun bats /opt/gun-nodejs-bugs/tests/
```

## Running stuff manually

```
$ docker-compose up -d
Creating gun-nodejs-bugs_gun_1 ... done
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
  
$ docker-compose exec gun bats /opt/gun-nodejs-bugs/tests/001-put-axe.bats
 ✓ put() without AXE
 ✗ put() with AXE
   (in test file /opt/gun-nodejs-bugs/tests/001-put-axe.bats, line 8)
     `node /opt/gun-nodejs-bugs/ get "$BATS_TEST_FILENAME" "$BATS_TEST_NAME" | grep "$BATS_TEST_FILENAME.$BATS_TEST_NAME: $BATS_TEST_NAME"' failed
   DEBUG :: gunSettings:
     - localStorage : false
     - peers        : http://localhost:8765/gun
     - radisk       : false
     - axe          : true
   DEBUG :: using default gunInstance
   Hello wonderful person! :) Thanks for using GUN, feel free to ask for help on https://gitter.im/amark/gun and ask StackOverflow questions tagged with 'gun'!
   DEBUG :: SEA.throw is: true
   AXE enabled.
   AXE enabled.
   DEBUG :: key: /opt/gun-nodejs-bugs/tests/001-put-axe.bats
   DEBUG :: subkey: test_put-28-29_with_AXE
   DEBUG :: text: test_put-28-29_with_AXE

2 tests, 1 failure

```
