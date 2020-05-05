const Gh = require('@octokit/rest')
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
    console.log("Time since typescript-bot's last activity: " + (new Date().valueOf() - mostRecent.valueOf()) / 1000)
    if ((new Date().valueOf() - mostRecent.valueOf()) > 7200000) {
        console.log("typescript-bot hasn't been active in over 2 hours (7200 seconds)")
        throw new Error();
    }
}

/** returns {Promise<Date>} */
async function recentActivity() {
    const dtEvents = await gh.activity.listRepoEvents({owner: "DefinitelyTyped", repo: "DefinitelyTyped" })
    let i = 0
    for (const event of dtEvents.data) {
        console.log(event.created_at)
        i++
        if (i > 3) break
    }


    const events = await gh.activity.listEventsForUser({ username: 'typescript-bot' })
    for (const event of events.data) {
        if (event.repo.name === 'DefinitelyTyped/DefinitelyTyped') {
            return new Date(event.created_at)
        }
    }
}
main().catch(e => { console.log(e); process.exit(1) })
