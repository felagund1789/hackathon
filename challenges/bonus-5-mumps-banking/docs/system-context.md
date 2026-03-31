# System Context: First National Bank Core Banking

First National Bank has operated this core banking system since 1997. The system was originally written by R.K. Sharma and has been maintained by a series of developers over the years. The most recent changes were made by J. Patterson in 2019.

## What the system does

The application handles day-to-day banking operations:

- Customer enrollment and identity management
- Deposit accounts (savings, checking, fixed deposits)
- Teller transactions (deposits, withdrawals, transfers)
- Consumer loan origination and payment processing
- Interest calculation and end-of-day batch processing
- Audit trail for all operations
- Role-based access (admin, teller, auditor)

## Technology

The system is written entirely in **MUMPS** (also called "M"), a language designed for database-driven applications. MUMPS is unusual in that the database is built into the language itself -- global variables (names starting with `^`) persist to disk automatically. There is no separate database server.

The codebase runs on **YottaDB**, an open-source MUMPS implementation. All source files are in the `routines/` directory with `.m` extensions.

## Known issues from the maintenance log

- A hardcoded fee amount in the batch module that should read from configuration
- A comment referencing a "temporary fix" from 2012 that was never cleaned up
- A dead code path for a "GOLD" account type that was discontinued in 2014
- Interest posting uses day-of-month >= 28 as a rough month-end check instead of actual calendar logic
- Fixed deposit interest uses simple interest while savings/checking use daily compounding
- The password hashing function is not cryptographically secure (noted in code comments)

## Default credentials

After initialization, log in with:

- **User:** `admin`
- **Password:** `admin123`

Other users: `teller1`, `teller2` (password: `teller123`), `auditor1` (password: `audit123`).

For instructions on installing YottaDB and running the application, see [Running the App](running-the-app.md).
