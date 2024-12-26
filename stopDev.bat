@echo off

:: Fechar o PWA específico pelo app-id
echo Procurando o PWA para fechar...
for /f "tokens=2 delims=," %%a in ('tasklist /FI "IMAGENAME eq chrome.exe" /v /FO CSV ^| findstr /I "--app-id=hbblfifohofgngfbjbiimbbcimepbdcb"') do (
    echo Fechando o PWA com PID %%a...
    taskkill /F /PID %%a >nul 2>&1
)

:: Parar o processo do backend (Node.js)
echo Parando o backend...
taskkill /F /IM node.exe >nul 2>&1

:: Parar o processo do frontend (Node.js)
echo Parando o frontend...
taskkill /F /IM node.exe >nul 2>&1

echo Todos os serviços foram parados.
exit
