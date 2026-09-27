# ============================================================================
# LinguaFlow AI — Localhost Server Launcher (PowerShell)
# Run this script in PowerShell to host the app on http://localhost:8080
# ============================================================================

$Port = 8080
$Root = $PSScriptRoot
if (-not $Root) { $Root = "e:\all\testing 3" }
$Url = "http://localhost:$Port/"

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host " Starting LinguaFlow AI on $Url" -ForegroundColor Green
Write-Host " Root Directory: $Root" -ForegroundColor Gray
Write-Host " Press Ctrl+C to stop the server." -ForegroundColor Yellow
Write-Host "=====================================================" -ForegroundColor Cyan

# Open default browser automatically
Start-Process $Url

# Option 1: Try Python HTTP Server if installed
if (Get-Command python -ErrorAction SilentlyContinue) {
    Set-Location $Root
    python -m http.server $Port
    exit
}

# Option 2: Built-in Native PowerShell HttpListener (Zero external tools required)
$Listener = New-Object System.Net.HttpListener
$Listener.Prefixes.Add($Url)
$Listener.Start()

$MimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

try {
    while ($Listener.IsListening) {
        $Context = $Listener.GetContext()
        $Request = $Context.Request
        $Response = $Context.Response

        $LocalPath = $Request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($LocalPath)) {
            $LocalPath = "index.html"
        }

        $FilePath = Join-Path $Root $LocalPath
        if (Test-Path $FilePath -PathType Leaf) {
            $Ext = [System.IO.Path]::GetExtension($FilePath).ToLower()
            $Response.ContentType = if ($MimeTypes.ContainsKey($Ext)) { $MimeTypes[$Ext] } else { "application/octet-stream" }
            $Bytes = [System.IO.File]::ReadAllBytes($FilePath)
            $Response.ContentLength64 = $Bytes.Length
            $Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
        } else {
            $Response.StatusCode = 404
        }
        $Response.OutputStream.Close()
    }
} finally {
    $Listener.Stop()
}
