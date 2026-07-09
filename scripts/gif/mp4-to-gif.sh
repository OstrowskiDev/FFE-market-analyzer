# generate color palettes

ffmpeg -i best-trade.mp4 \
-vf "fps=30,palettegen" \
best-trade-palette.png

ffmpeg -i station-data.mp4 \
-vf "fps=30,palettegen" \
station-data-palette.png

# generate gif files

ffmpeg -i best-trade.mp4 -i best-trade-palette.png \
-filter_complex "fps=30[x];[x][1:v]paletteuse" \
best-trade.gif


ffmpeg -i station-data.mp4 -i station-data-palette.png \
-filter_complex "fps=30[x];[x][1:v]paletteuse" \
station-data.gif

# remove palettes

rm best-trade-palette.png
rm station-data-palette.png