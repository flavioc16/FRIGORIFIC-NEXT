@echo off

:: Identificar e matar o processo do PWA específico usando app-id no Chrome
for /f "tokens=2 delims=," %%a in ('tasklist /FI "IMAGENAME eq chrome.exe" /v /FO CSV ^| findstr "--app-id=hbblfifohofgngfbjbiimbbcimepbdcb"') do (
    set pid=%%a
    call :killPWA
)

:: Parar o processo do backend (ts-node ou node)
taskkill /F /IM node.exe >nul 2>&1

:: Parar o processo do frontend (next.js)
taskkill /F /IM node.exe >nul 2>&1

exit

:killPWA
:: Fechar o processo do PWA com o PID específico
taskkill /F /PID %pid% >nul 2>&1
exit /b
