@echo off

:: Iniciar o backend em uma nova janela oculta
start "" /b cmd /c "cd /d C:\frigorifico\backend && yarn dev"

:: Iniciar o frontend em uma nova janela oculta
start "" /b cmd /c "cd /d C:\frigorifico\frontend && yarn dev"

:: Abrir o PWA no Chrome
start "" "C:\Program Files\Google\Chrome\Application\chrome_proxy.exe" --profile-directory=Default --app-id=hbblfifohofgngfbjbiimbbcimepbdcb"

exit
