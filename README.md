# weekability

100% Offline Personal Finance Tracker

No internet, no servers, no tracking, no subscriptions No bullshit. 
Basically a turbo-charged spreadsheet!

## Weekability Manifesto

There are many trackers like YNAB , Copilot, Monarch, Quicken, Rocket, etc

So why weekability?

Weekability Values:

- Free
- Open-Source
- Privacy
- Simple
- Manual

By principal, any tool designed to save you money should not be costing you money. 

All software when can be, should be open-source. There are no downsides, only upsides to this!

Finances are deeply personal, there should be a guarantee of 100% privacy with no possibility of data leaks. Offline is the only way to guarantee this.

Nobody needs fancy animations or AI. Spreadsheets work and is what I currently use. But sometimes you need just a *little* more, like charts and filters. Weekability fills this hole.

What I've noticed with the automated trackers is, the budget gets relegated to least priority mentally, since it happens automatically. An uptick in spending doesn't "hit" you, because you're not manually adding data. Think of it as taking notes by handwriting them vs recording audio of the lecture. Sure, you have the information with both methods, but when done manually it registers deeper with your brain.
That is a tradeoff I believe is necessary if you're serious about controlling your finances. This is why data entry will be through .csv import from banks. This will force you to login to your bank every payday, and actually see your finances with your own eyes.

Of course, since this is open-source, feel free to fork and add a [Plaid](https://plaid.com/) integration to do this automatically. I will add instructions on how to do this soon.

# Development

## Set database path
The SQLite database will be stored in your system’s application data directory:

    Windows: C:\Users\<Username>\AppData\Roaming\com.weekability.app

    macOS: ~/Library/Application Support/com.weekability.app

    Linux: ~/.local/share/com.weekability.app

Set `DATABASE_URL` to one of the above depending on your system. 

## Starting the app

1. `bun i`
2. `bunx tauri dev`

## Stack

### Backend
- [Tauri](http://tauri.app/)
- [SQLite](https://www.sqlite.org/) with [sqlx](https://github.com/launchbadge/sqlx)

### Frontend
- [React](http://react.dev/)
- [Bun](https://bun.sh) + [Vite](https://vite.dev)
- [Tanstack Router](https://tanstack.com/router/latest)
- [Tailwindcss](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Biomejs](https://biomejs.dev) - `bunx biome check --write .`
