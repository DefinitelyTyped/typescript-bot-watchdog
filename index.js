const Gh = require('@octokit/rest')
var gh = new Gh({
    auth: `token ${process.env["TYPESCRIPT_BOT_WATCHDOG_TOKEN"] || ""}`
})

async function main() {
    const activity = await recentActivity()

    if (!activity) {
        console.log("Couldn't find any recent activity for typescript-bot")
        throw new Error()
    }
    const [anyRecent, botRecent] = activity
    // 1. anyRecent - botRecent < 2 hours || present - botRecent < 2 hour
    console.log()
    console.log()
    console.log("Time since typescript-bot's last activity: " + (new Date().valueOf() - botRecent.valueOf()) / 1000)
    console.log("Time between most recent activity and typescript-bot's most recent activity: " + (anyRecent.valueOf() - botRecent.valueOf()) / 1000)
    if ((new Date().valueOf() - botRecent.valueOf()) > 7200000 && (anyRecent.valueOf() - botRecent.valueOf()) > 7200000) {
        console.log("typescript-bot hasn't responded or been active in over 2 hours (7200 seconds)")
        throw new Error();
    }
}

/** @returns {Promise<[Date, Date] | undefined>} */
async function recentActivity() {
    const dtEvents = await gh.activity.listRepoEvents({owner: "DefinitelyTyped", repo: "DefinitelyTyped" })
    let latestEvent
    for (const event of dtEvents.data) {
        latestEvent = new Date(event.created_at)
        break
    }
    if (!latestEvent) {
        throw new Error("couldn't get events for DefinitelyTyped repo")
    }

    const events = await gh.activity.listEventsForUser({ username: 'typescript-bot' })
    for (const event of events.data) {
        if (event.repo.name === 'DefinitelyTyped/DefinitelyTyped') {
            return [latestEvent, new Date(event.created_at)]
        }
    }
}
main().catch(e => { console.log(e); process.exit(1) })
