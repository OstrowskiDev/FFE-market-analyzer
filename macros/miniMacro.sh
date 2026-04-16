#!/bin/bash
# poniższe notatki dotyczą zachowania skryptu gdy jest uruchamiany z skrótu klawiszowego wewnątrz dosbox-x:
# ydotool mousemove 480 262 // przesuwa lekko w dół
# ydotool mousemove 480 260  // przesuwa lekko w górę
# ydotool mousemove 481 261 // przesuwa lekko w prawo
# ydotool mousemove 479 261 // przesuwa lekko w lewo
# wniosek, centrum układu rel: 480 261
# dlaczego taka liczba?
# ydotool mousemove 480 261 // to o dziwo rusza mysz w lewy górny narożnik, mysz nie stoi w miejscu
# ydotool click 1 // działa

# ydotool key LEFTCTRL+F10 // działa

# działą tylko gdy skrypt jest wywołany z terminala

# ydotool key KEY_PRINT // nie działa nawet w OS

# ydotool key KEY_SYSRQ // nie działa nawet w OS

# ydotool key F12+p // działa jako prt scr wewnątrz dosbox-x bo korzysta z komendy dosbox-x do robienia zrzutów ekranu

# ydotool mousemove 505 296

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


