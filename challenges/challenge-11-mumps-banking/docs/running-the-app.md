# Running the MUMPS Banking Application

Running the original MUMPS code is **optional** for this challenge -- you can read and translate the `.m` files without a runtime. But if you want to see the system in action, here is how.

## Prerequisites

The devcontainer at `.devcontainer/challenge-11-mumps-banking/` handles setup automatically. It runs `setup-yottadb.sh` on creation, which installs the [YottaDB](https://yottadb.com/) open-source MUMPS implementation.

If you are not using that devcontainer, install YottaDB manually. Pin to r1.38 -- later versions need GLIBC 2.38+, which Ubuntu 22.04 does not ship:

```bash
# Install dependencies
sudo apt-get update
sudo apt-get install -y binutils libelf-dev libicu-dev libjansson-dev wget file

# Run the YottaDB installer (pinned to r1.38 for Ubuntu 22.04 compatibility)
wget -q "https://gitlab.com/YottaDB/DB/YDB/raw/master/sr_unix/ydbinstall.sh"
chmod +x ydbinstall.sh
sudo ./ydbinstall.sh --utf8 --installdir /opt/yottadb --force-install r1.38
```

See the [YottaDB install guide](https://docs.yottadb.com/AdminOpsGuide/installydb.html) if these steps fail on your platform.

## Setting Up the Environment

Source the YottaDB environment, disable the encryption plugin (not needed here), and point it at the banking routines:

```bash
source /opt/yottadb/ydb_env_set
unset ydb_crypt_config gtmcrypt_config gtm_passwd ydb_passwd
export ydb_routines="$(pwd)/routines /opt/yottadb/libyottadbutil.so"
```

Run these from the `challenges/challenge-11-mumps-banking/` directory. The path must be absolute -- relative paths break if you change directories after setting `ydb_routines`. This sets the variable from scratch rather than appending to it, which avoids accumulating stale paths across multiple exports.

## Initializing the Database

Start the YottaDB interactive shell and run the initialization routine. This loads seed data -- customers, accounts, loans, users, and system configuration:

```bash
ydb
```

```text
YDB> DO INIT^BNKINIT
```

You will see output confirming the setup. This step **clears all existing data** and creates fresh seed records, so only run it once (or again when you want a clean slate).

## Starting the Application

From the YottaDB shell:

```text
YDB> DO ^BNKMAIN
```

This launches the main menu. Log in with one of the default accounts:

| User | Password | Role |
|------|----------|------|
| `admin` | `admin123` | ADMIN -- full access including batch processing and user management |
| `teller1` | `teller123` | TELLER -- can process transactions |
| `teller2` | `teller123` | TELLER -- can process transactions |
| `auditor1` | `audit123` | AUDITOR -- read-only access to reports and audit logs |

## Quick Walkthrough

After logging in as `admin`, try these operations to get oriented:

1. **View customers** -- Select option 1 (Customer Management), then list or search.
2. **Check an account balance** -- Option 2 (Account Management), then view an account.
3. **Make a deposit** -- Log in as `teller1`, option 3 (Transactions), then deposit.
4. **Run end-of-day batch** -- Log in as `admin`, option 6. This calculates interest, checks loans, and charges fees.
5. **View reports** -- Option 5 for statements and portfolio summaries.

## Stopping the Application

Type `Q` at the main menu to log out, then `HALT` (or `H`) to exit the YottaDB shell:

```text
YDB> HALT
```

## Troubleshooting

**"ydb: command not found"** -- The environment is not sourced. Run `source /opt/yottadb/ydb_env_set` first.

**"routine not found" errors** -- The `ydb_routines` path does not include the `routines/` directory. Check your `export` command and make sure the path is correct relative to your current directory.

**"INIT already run" or stale data** -- Run `DO INIT^BNKINIT` again to reset everything. This is destructive -- it wipes all globals and reloads seed data.

**"CRYPTDLNOOPEN2" or encryption library errors** -- The encryption plugin is not needed. Run `unset ydb_crypt_config gtmcrypt_config gtm_passwd ydb_passwd` before starting `ydb`.

**Installation fails** -- The devcontainer setup script treats YottaDB install failure as non-fatal (`|| true`). If it failed during container build, run `bash .devcontainer/challenge-11-mumps-banking/setup-yottadb.sh` manually. Check that you are on a supported architecture (amd64 or aarch64).
