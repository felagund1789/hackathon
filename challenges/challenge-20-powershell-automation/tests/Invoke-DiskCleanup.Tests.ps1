# Invoke-DiskCleanup.Tests.ps1
# Pester test scaffold for Invoke-DiskCleanup.ps1
# TODO: Use Copilot to fill in mocks for Invoke-Command, Remove-Item, Stop-Service, Start-Service.

BeforeAll {
    . "$PSScriptRoot\..\scripts\Invoke-DiskCleanup.ps1"
}

Describe "Invoke-DiskCleanup" {
    Context "Given a reachable computer" {
        It "invokes cleanup on the remote machine" {
            # TODO
        }

        It "logs the bytes freed per machine" {
            # TODO
        }
    }

    Context "Given an unreachable computer" {
        It "logs the error and continues to the next machine" {
            # TODO
        }
    }
}
