#!/usr/bin/env node

const yargs = require("yargs");

// we will deal with that later, in setup_gun()
var Gun = null;
var gunInstance = null
var gunInstance2 = null
//var gunAPI = null;

// are we in debug mode
var debug = true;

// default Gun config settings
var gunSettings = {
    peers: ['http://localhost:8765/gun'],
    localStorage: false,
    radisk: false,
    axe: false
}


/* +-----------------------------------------------------------------------+ *\
|* | general utility function                                              | *|
\* +-----------------------------------------------------------------------+ */

/*
 * load and set-up Gun
 * 
 * Gun pollutes the console output with an annoying message
 * so we don't want to load it until we have to
 */
let setup_gun = () => {

    // load Gun
    if (Gun === null) {
        Gun = require("gun");
        Gun.SEA.throw = true;
        debuglog(`SEA.throw is: ${Gun.SEA.throw}`)
    }
    
    // set the Gun instances up
    if (gunInstance === null) {
        gunInstance = Gun(gunSettings);
    }
    // we need two to test if content is really pushed to the peer
    if (gunInstance2 === null) {
        gunInstance2 = Gun(gunSettings);
    }
}

/*
 * accepts any number of arguments
 * and works similar to console.log(a, b, c)
 */
let debuglog = (...msg) => {
    if (debug) {
        console.log('DEBUG ::', msg.join(' '))
    }
}


/* +-----------------------------------------------------------------------+ *\
|* | low-level functions                                                   | *|
\* +-----------------------------------------------------------------------+ */

/**
 * auth a Gun user,
 * using either a username+password combination, or a pubkey
 * 
 * username - name/alias of the user
 * password - password to use for authenticating as the `username` user
 * pubkey   - alternatively, a pubkey can be used for auth (but functionality will be limited)
 */
/*let gun_auth_user = (username=false, password=false, pubkey=false, gun=false) => {
    if (gun===false) {
        debuglog('using default gunInstance')
        setup_gun()
        gun = gunInstance
    }
    return new Promise(
        (resolve, reject) => {
            if (username && password) {
                gunAPI = gun.user()
                gunAPI.auth(username, password, function(userReference){
                    if (userReference.err) {
                        reject(new Error(userReference.err))
                    } else {
                        console.log('Update user authenticated using password.');
                        var pub = gunAPI._.soul.slice(1)
                        gunAPITwo = gunTwo.user(pub);
                        debuglog("user's pubkey:", pub)
                        console.log('Verification user authenticated from a pubkey.');
                        resolve(gunAPI)
                    }
                })
            } else if (pubkey) {
                gunAPI = gun.user(pubkey);
                console.log('User authenticated from a pubkey.');
                resolve(gunAPI)
            } else {
                console.log('ERROR: Neither user and password, nor a public key of a user were provided,');
                console.log('ERROR: so there is no Gun account to work with!');
                reject(new Error("Not able to authenticate the user with Gun."))
            }
        }
    )
}*/

let gun_get = (key, subkey=false, gun=false) => {
    if (gun===false) {
        debuglog('using default gunInstance')
        setup_gun()
        gun = gunInstance
    }
    debuglog(`key: ${key}`)
    if (subkey) {
        debuglog(`subkey: ${subkey}`)
        gun.get(key).get(subkey).on((v, k)=>{
            console.log(`${key}.${k}: ${v}`)
        })
    } else {
        gun.get(key).map().on((v, k)=>{
            console.log(`${key}.${k}: ${v}`)
        })
    }
    setTimeout(()=>{process.exit(0)}, 2000)
}

let gun_put = (key, subkey, text, gun=false) => {
    if (gun===false) {
        debuglog('using default gunInstance')
        setup_gun()
        gun = gunInstance
    }
    debuglog(`key: ${key}`)
    debuglog(`subkey: ${subkey}`)
    debuglog(`text: ${text}`)
    gun.get(key).get(subkey).put(text)
    setTimeout(()=>{process.exit(0)}, 2000)
}


/* +-----------------------------------------------------------------------+ *\
|* | defined tests                                                         | *|
\* +-----------------------------------------------------------------------+ */

/*let tests = {
    'put-axe': ()=>{
        
        // prepare the Gun instances
        Gun = require("gun");
        gunSettings.axe = true
        var gunWithAxe = Gun(gunSettings)
        var gunWithAxe2 = Gun(gunSettings)
        gunSettings.axe = false
        var gunWithoutAxe = Gun(gunSettings)
        var gunWithoutAxe2 = Gun(gunSettings)
        
        var d = new Date();
        var t = d.getTime();
        var testId = `test-at-${t}`
        
        console.log('\n1. testing with AXE *enabled*...')
        console.log(`  - testId: ${testId}`)
        console.log('  - put()...')
        gun_put(testId, 'with-axe', 'with-axe-content', gunWithAxe)
        console.log('  - get()...')
        gun_get(testId, 'with-axe', gunWithAxe2)
        
        console.log('  - done.')
        setTimeout(()=>{
            console.log('\n2. testing with AXE *disabled*')
            console.log(`  - testId: ${testId}`)
            console.log('  - put()...')
            gun_put(testId, 'without-axe', 'without-axe-content', gunWithoutAxe)
            console.log('  - get()...')
            gun_get(testId, 'without-axe', gunWithoutAxe2)
            console.log('  - done.')
            setTimeout(()=>{process.exit(0)}, 1000)
        }, 1000)
    }
}*/


/* +-----------------------------------------------------------------------+ *\
|* | cli setup                                                             | *|
\* +-----------------------------------------------------------------------+ */

const options = yargs
    .scriptName("gun-nodejs-bugs")
    .showHelpOnFail(true)
    .demandCommand(1, '')
    .usage("gun-nodejs-bugs\n\nUsage:\n  $0 [options] <command> [positionals]")
    .option("d", { alias: "debug", describe: "Enable debug output", type: "boolean", default: true, demandOption: false })
    .option("P", { alias: "peer", describe: "Upstream peer", type: "string", default: 'http://localhost:8765/gun',  demandOption: false })
    .option("L", { alias: "local-storage", describe: "Should localStorage be used", type: "boolean", default: false, demandOption: false })
    .option("R", { alias: "radisk", describe: "Should radisk be used", type: "boolean", default: false, demandOption: false })
    .option("A", { alias: "axe", describe: "Should AXE be used", type: "boolean", default: false, demandOption: false })
    .middleware((argv)=>{
        // make sure debug is sanely available globally
        debug = argv.debug
        // same for Gun settings
        gunSettings.peers = [argv.peer]
        gunSettings.localStorage = argv.localStorage
        gunSettings.radisk = argv.radisk
        gunSettings.axe = argv.axe
        // inform
        debuglog(
            `gunSettings:\n` +
            `  - localStorage : ${gunSettings.localStorage}\n` +
            `  - peers        : ${gunSettings.peers[0]}\n` +
            `  - radisk       : ${gunSettings.radisk}\n` +
            `  - axe          : ${gunSettings.axe}`
        )
    })
    .command(
        "get <key> [subkey]",
        "View a Gun node.",
        (yargs) => {
            yargs
                .positional('key', {'describe': "Key to get."})
                .positional('subkey', {'describe': "Subkey to get (optional)."})
        },
        (argv)=>{
            gun_get(argv.key, argv.subkey)
        })
    .command(
        "put <key> <subkey> <text>",
        "Update a Gun node.",
        (yargs) => {
            yargs
                .positional('key', {'describe': "Key to update."})
                .positional('subkey', {'describe': "Subkey to update."})
                .positional('text', {'describe': "Text to update the key with."})
        },
        (argv)=>{
            gun_put(argv.key, argv.subkey, argv.text)
        })
    /*.command(
        "test <testname>",
        "Run a predefined test.",
        (yargs) => {
            yargs
                .positional('testname', {'describe': "Name of the test to run."})
        },
        (argv)=>{
            if (tests[argv.testname]) {
                tests[argv.testname]()
            } else {
                console.log('Available tests:', Object.keys(tests).join(', '))
            }
        })*/
    .help()
    .argv;
