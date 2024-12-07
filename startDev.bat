@echo off
cd /d C:\frigorifico

:: Iniciar o backend em uma janela separada
start cmd /k "cd backend && yarn dev"

:: Iniciar o frontend em uma janela separada
start cmd /k "cd frontend && yarn dev"

:: Esperar alguns segundos para garantir que o frontend tenha iniciado
timeout /t 5

:: Abrir o PWA via chrome.exe com o app-id
start "" "C:\Program Files\Google\Chrome\Application\chrome_proxy.exe" --profile-directory=Default --app-id=bknjoblmmmbhaonhokehphogmphaninn
:: Pausar para manter o terminal aberto
pause
