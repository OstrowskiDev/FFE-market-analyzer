#!/bin/bash

# this macro is for linux only

# it requires ydotool to function, add this package to your os if you don't have one

# it is compatible with dosbox-x versions that uses F12+p for printscreen's, if your version of dosbox-x uses different keys, change F12+p in code below accordingly

ydotool key LEFTCTRL+F10
sleep 0.1
ydotool key F12+p
sleep 0.5
ydotool key LEFTCTRL+F10
sleep 0.1

for i in {1..13}; do
ydotool click 1
sleep 0.05
done

sleep 0.1
ydotool key LEFTCTRL+F10
sleep 0.1
ydotool key F12+p
sleep 0.5
ydotool key LEFTCTRL+F10
sleep 0.1

for i in {1..7}; do
ydotool click 1
sleep 0.05
done

ydotool key LEFTCTRL+F10
sleep 0.1
ydotool key F12+p
sleep 0.1
ydotool key LEFTCTRL+F10
