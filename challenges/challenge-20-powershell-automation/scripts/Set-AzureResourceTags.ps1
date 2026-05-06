# Set-AzureResourceTags.ps1
# Applies a standard tag set to all untagged resources in an Azure subscription.
# Tags: Environment, CostCenter, Owner, CreatedDate
# TODO: No parameter validation, no idempotency check, no output object. Fix with Copilot.

param(
    [string]$SubscriptionId,
    [string]$Environment,
    [string]$CostCenter,
    [string]$Owner
)

Connect-AzAccount
Set-AzContext -SubscriptionId $SubscriptionId

$resources = Get-AzResource

foreach ($resource in $resources) {
    $tags = $resource.Tags

    if ($tags -eq $null) {
        $tags = @{}
    }

    $tags["Environment"]  = $Environment
    $tags["CostCenter"]   = $CostCenter
    $tags["Owner"]        = $Owner
    $tags["CreatedDate"]  = (Get-Date -Format "yyyy-MM-dd")

    Set-AzResource -ResourceId $resource.ResourceId -Tag $tags -Force
}
