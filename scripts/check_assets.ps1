$base='http://localhost:63839'
$html=(Invoke-WebRequest $base -UseBasicParsing).Content
$pattern = "(?:\\./|/)?assets/[^>\\s\\u0022\\u0027]+"
$matches = [regex]::Matches($html,$pattern) | ForEach-Object { $_.Value } | Select-Object -Unique
if (-not $matches) { Write-Host 'No assets found'; exit 0 }
foreach ($m in $matches) {
  $rel = $m -replace '^\./',''
  $url = $base.TrimEnd('/') + '/' + $rel.TrimStart('/')
  try {
    $h = Invoke-WebRequest -Uri $url -Method Get -UseBasicParsing -ErrorAction Stop
    $ct=$h.Headers['Content-Type']
    $cl=($h.RawContentLength -as [string])
    Write-Host "$url`tStatus:$($h.StatusCode)`tCT:$ct`tLen:$cl"
  } catch {
    Write-Host "$url`tERROR: $($_.Exception.Message)"
  }
}
