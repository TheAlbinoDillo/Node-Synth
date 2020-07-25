@echo off
:A
cd C:\Users\mojo4\Documents\GitHub\Bot-FurGun
echo Starting bot...
node .
if %errorlevel%==2 (echo Bot Disconnected)
if %errorlevel%==5 (GOTO A) else (pause & GOTO A)
pause