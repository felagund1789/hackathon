# Invoke-DiskCleanup.ps1
# Removes temp files, empties Recycle Bin, and clears Windows Update cache on a list of remote machines.
# This script has no error handling, no logging, and no size reporting.
# TODO: Use Copilot to add proper error handling, structured logging, and a size-freed summary.

param(
    [Parameter(Mandatory)]
    [string[]]$ComputerName,
    [string]$LogPath = "C:\Logs\DiskCleanup"
)

foreach ($computer in $ComputerName) {
    Invoke-Command -ComputerName $computer -ScriptBlock {
        Remove-Item -Path "$env:TEMP\*" -Recurse -Force
        Clear-RecycleBin -Force
        Stop-Service -Name wuauserv
        Remove-Item -Path "C:\Windows\SoftwareDistribution\Download\*" -Recurse -Force
        Start-Service -Name wuauserv
    }
}
