const Gh = require('@octokit/rest')
const http = require('https')
var gh = new Gh({
    auth: `token ${process.env["TYPESCRIPT_BOT_WATCHDOG_TOKEN"] || ""}`
})

async function main() {
    const mostRecent = await recentActivity()

    if (!mostRecent) {
        console.log("Couldn't find any recent activity for typescript-bot")
        throw new Error()
    }
    console.log()
    console.log()
    console.log("Time since typescript-bot's last activity: " + (Date.now() - mostRecent.valueOf()) / 1000)
    // github incorrectly formats the current time zone as GMT, so undo that manually
    if (((Date.now() - 7 * 3600000) - mostRecent.valueOf()) > 7200000) {
        console.log("typescript-bot hasn't been active in over 2 hours (7200 seconds)")
        throw new Error();
    }
    console.log()
    console.log()
    console.log()
    console.log()
    console.log()
    // Cheat to keep watchdogs running -- if nobody looks at the status pages (not the badges)
    // then the watchdogs stop running. So make it look at the pages itself
    let request = http.get("https://typescript.visualstudio.com/TypeScript/_build?definitionId=13")
    request.on('response', res => res.on('data', s => console.log(s.toString().slice(0,100))));
    request.end();
    request = http.get("https://typescript.visualstudio.com/TypeScript/_build?definitionId=14")
    request.on('response', res => res.on('data', s => console.log(s.toString().slice(0,100))));
    request.end();
}

/** returns {Promise<Date>} */
async function recentActivity() {
    const events = await gh.activity.listEventsForUser({ username: 'typescript-bot', headers: { "time-zone": "Europe/Amsterdam" } })
    for (const event of events.data) {
        if (event.repo.name === 'DefinitelyTyped/DefinitelyTyped') {
            return new Date(event.created_at)
        }
    }
}
main().catch(e => { console.log(e); process.exit(1) })
