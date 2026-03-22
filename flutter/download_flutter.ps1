# Download Flutter from official source
$ErrorActionPreference = "Stop"

$url = "https://storage.googleapis.com/flutter_infra_release/releases/stable/windows/flutter_windows_3.38.5-stable.zip"
$output = "C:\src\flutter.zip"

Write-Host "Downloading Flutter SDK..." -ForegroundColor Cyan
Write-Host "URL: $url" -ForegroundColor Gray
Write-Host "Output: $output" -ForegroundColor Gray

# Create directory
if (-not (Test-Path "C:\src")) {
    New-Item -Path "C:\src" -ItemType Directory -Force | Out-Null
}

# Download with progress
try {
    $webClient = New-Object System.Net.WebClient
    
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    
    Register-ObjectEvent -InputObject $webClient -EventName DownloadProgressChanged -SourceIdentifier DLProgress -Action {
        $Global:DLProgress = $EventArgs.ProgressPercentage
        $received = $EventArgs.BytesReceived / 1MB
        $total = $EventArgs.TotalBytesToReceive / 1MB
        Write-Progress -Activity "Downloading Flutter SDK" -Status "$([math]::Round($received, 1)) MB / $([math]::Round($total, 1)) MB ($($EventArgs.ProgressPercentage)%)" -PercentComplete $EventArgs.ProgressPercentage
    } | Out-Null
    
    Write-Host "Starting download..." -ForegroundColor Yellow
    $webClient.DownloadFileAsync($url, $output)
    
    while ($webClient.IsBusy) {
        Start-Sleep -Milliseconds 500
    }
    
    Unregister-Event -SourceIdentifier DLProgress -ErrorAction SilentlyContinue
    $webClient.Dispose()
    $sw.Stop()
    
    if (Test-Path $output) {
        $size = (Get-Item $output).Length / 1MB
        Write-Host "`nDownload completed!" -ForegroundColor Green
        Write-Host "File size: $([math]::Round($size, 2)) MB" -ForegroundColor Gray
        Write-Host "Time: $([math]::Round($sw.Elapsed.TotalSeconds, 1)) seconds" -ForegroundColor Gray
    } else {
        Write-Host "`nDownload failed - file not created" -ForegroundColor Red
    }
}
catch {
    Write-Host "`nDownload error: $_" -ForegroundColor Red
}
