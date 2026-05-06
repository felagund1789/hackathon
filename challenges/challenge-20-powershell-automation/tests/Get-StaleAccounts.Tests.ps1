# Get-StaleAccounts.Tests.ps1
# Pester test scaffold for Get-StaleAccounts.ps1
# TODO: Use Copilot to fill in the Describe/It blocks. Mock Get-ADUser so tests run without AD.

BeforeAll {
    . "$PSScriptRoot\..\scripts\Get-StaleAccounts.ps1"
}

Describe "Get-StaleAccounts" {
    Context "Given accounts that have not logged in for more than DaysInactive" {
        It "returns only stale accounts" {
            # TODO
        }

        It "returns a PSCustomObject with the expected properties" {
            # TODO
        }
    }

    Context "Given all accounts are active" {
        It "returns an empty result" {
            # TODO
        }
    }

    Context "Given an invalid DaysInactive value" {
        It "throws a parameter validation error" {
            # TODO
        }
    }
}
