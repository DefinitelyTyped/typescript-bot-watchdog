## Is typescript-bot working right now?

If the badge below is green, then typescript-bot has been active on
DefinitelyTyped some time in the last two hours:

[![Build Status](https://typescript.visualstudio.com/TypeScript/_apis/build/status/sandersn.types-publisher-watchdog)](https://typescript.visualstudio.com/TypeScript/_build/latest?definitionId=13)

typescript-bot-watchdog reports on recent activity by typescript-bot,
but only on the DefinitelyTyped repo. The watchdog just checks the
time of the first event from typescript-bot's feed.

The watchdog pays attention to two kinds of data from DefinitelyTyped
PRs: the date and the filenames. It could also use the declared
version number from the header, but does not currently.


## Limitations

I haven't checked whether the activity feed orders events most recent
first. It would be super weird if it didn't.
