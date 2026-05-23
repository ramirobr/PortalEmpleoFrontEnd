$targetDirs = @("app", "components")

foreach ($dir in $targetDirs) {
    if (Test-Path $dir) {
        Get-ChildItem -Path $dir -Recurse -Include *.tsx,*.ts,*.css | ForEach-Object {
            $content = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::UTF8)
            $modified = $false

            # Replace text-zinc- with text-slate-
            if ($content -like '*text-zinc-*') {
                $content = $content -replace 'text-zinc-','text-slate-'
                $modified = $true
            }

            # Replace text-[10px] with text-[11px]
            if ($content -like '*text-[10px]*') {
                $content = $content -replace 'text-\[10px\]','text-[11px]'
                $modified = $true
            }

            if ($modified) {
                [System.IO.File]::WriteAllText($_.FullName, $content, [System.Text.Encoding]::UTF8)
                Write-Host "Updated: $($_.FullName)"
            }
        }
    }
}
