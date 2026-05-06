# Get-StaleAccounts.ps1
# Lists Active Directory user accounts that have not logged in within a given number of days.
# TODO: This script has several issues -- use Copilot to find and fix them.

param(
    [int]$DaysInactive = 90,
    [string]$SearchBase
)

$cutoff = (Get-Date).AddDays($DaysInactive)  # bug: should subtract, not add

$filter = {LastLogonDate -lt $cutoff -and Enabled -eq $true}

$accounts = Get-ADUser -Filter $filter -SearchBase $SearchBase -Properties LastLogonDate, Department, Manager

foreach ($account in $accounts) {
    [PSCustomObject]@{
        SamAccountName = $account.SamAccountName
        DisplayName    = $account.Name
        LastLogon      = $account.LastLogonDate
        Department     = $account.Department
        Manager        = $account.Manager
    }
}
