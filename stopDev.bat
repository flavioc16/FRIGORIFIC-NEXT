@echo off
:: Parar o processo do backend (ts-node ou node)
taskkill /F /IM node.exe >nul 2>&1

:: Parar o processo do frontend (next.js)
taskkill /F /IM node.exe >nul 2>&1

:: Parar o PWA no Chrome (caso precise)
taskkill /F /IM chrome.exe >nul 2>&1

exit
