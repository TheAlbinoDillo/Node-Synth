@echo off
:A
cd C:\Users\mojo4\Documents\GitHub\Bot-FurGun
echo Starting bot...
node .
if %errorlevel%==5 (GOTO A)
if %errorlevel%==2 (echo Bot Disconnected) else (echo Bot Crashed)
pause