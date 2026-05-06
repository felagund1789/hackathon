# ContosoIT.psm1
# PowerShell module stub -- combine the individual scripts into a proper module here in Stage 5.
# Export only the public functions below.

#Requires -Version 5.1

# TODO: dot-source the individual script files and export their functions as part of this module.
# Use Copilot to scaffold the module structure, add a module manifest (.psd1), and wire up exports.

$scriptFiles = Get-ChildItem -Path "$PSScriptRoot\scripts" -Filter "*.ps1"
foreach ($file in $scriptFiles) {
    . $file.FullName
}
