@echo off

:: Iniciar o backend em uma nova janela oculta
start "" /b cmd /c "cd /d C:\Users\Usuario\FRIGORIFIC-NEXT\backend && yarn dev"

:: Iniciar o frontend em uma nova janela oculta
start "" /b cmd /c "cd /d C:\Users\Usuario\FRIGORIFIC-NEXT\frontend && yarn dev"

:: Abrir o PWA no Chrome
start "" "C:\Program Files\Google\Chrome\Application\chrome_proxy.exe" --profile-directory=Default --app-id=hbblfifohofgngfbjbiimbbcimepbdcb"

exit
