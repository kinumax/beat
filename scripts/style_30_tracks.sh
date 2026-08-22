#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p client/public/assets/styled
filters=(
"equalizer=f=180:t=q:w=1:g=4,chorus=0.5:0.9:50:0.35:0.25:2"
"equalizer=f=2500:t=q:w=1:g=3,aecho=0.35:0.10:36:0.05"
"lowpass=f=5200,highpass=f=90,aecho=0.35:0.10:42:0.05"
"highpass=f=140,lowpass=f=7800,flanger=delay=2:depth=2"
"acompressor=threshold=-18dB:ratio=3:attack=5:release=80,aecho=0.35:0.09:32:0.04"
"lowpass=f=2400,aecho=0.30:0.08:90:0.04"
"highpass=f=180,acompressor=threshold=-20dB:ratio=5:attack=2:release=50"
"equalizer=f=420:t=q:w=1:g=3,chorus=0.4:0.8:35:0.3:0.2:2"
"highpass=f=120,lowpass=f=9000,aecho=0.30:0.08:48:0.04"
"lowpass=f=4800,aphaser=in_gain=0.6:out_gain=0.8:delay=3:decay=0.4:speed=0.6"
"equalizer=f=1400:t=q:w=1:g=4,aecho=0.35:0.09:30:0.04"
"lowpass=f=3600,aecho=0.30:0.08:70:0.04,tremolo=f=2:d=0.35"
"equalizer=f=900:t=q:w=1:g=3,chorus=0.5:0.7:42:0.25:0.18:2"
"highpass=f=260,lowpass=f=6200,acrusher=bits=10:mix=0.28"
"lowpass=f=7000,aecho=0.32:0.09:72:0.04"
"equalizer=f=1100:t=q:w=1:g=4,chorus=0.45:0.8:28:0.25:0.16:2"
"highpass=f=160,lowpass=f=8200,aecho=0.28:0.07:55:0.035"
"equalizer=f=700:t=q:w=1:g=3,tremolo=f=3:d=0.22"
"acompressor=threshold=-16dB:ratio=2.5:attack=12:release=120,aecho=0.35:0.09:38:0.04"
"lowpass=f=3200,aecho=0.28:0.07:90:0.035"
"highpass=f=210,lowpass=f=6800,acrusher=bits=11:mix=0.18"
"equalizer=f=3200:t=q:w=1:g=4,chorus=0.45:0.85:38:0.3:0.2:2"
"lowpass=f=5000,aphaser=in_gain=0.7:out_gain=0.85:delay=2:decay=0.35:speed=0.4"
"equalizer=f=500:t=q:w=1:g=3,aecho=0.30:0.08:75:0.04"
"highpass=f=100,lowpass=f=7400,aecho=0.35:0.09:40:0.04"
"lowpass=f=4100,tremolo=f=1.7:d=0.3,aecho=0.30:0.08:70:0.04"
"equalizer=f=1800:t=q:w=1:g=3,chorus=0.4:0.7:34:0.22:0.14:2"
"highpass=f=190,lowpass=f=7600,chorus=0.5:0.75:46:0.3:0.2:2"
"equalizer=f=750:t=q:w=1:g=4,aecho=0.28:0.07:80:0.035"
"highpass=f=90,lowpass=f=9500,acompressor=threshold=-18dB:ratio=3:attack=8:release=100"
)
for i in $(seq -w 1 30); do
  idx=$((10#$i - 1))
  src="client/public/assets/track-${i}.mp3"
  tmp="client/public/assets/styled/track-${i}.mp3"
  ffmpeg -hide_banner -loglevel error -y -i "$src" -af "${filters[$idx]}" -codec:a libmp3lame -b:a 160k -ar 44100 -ac 2 "$tmp"
  mv "$tmp" "$src"
done
rm -rf client/public/assets/styled
printf 'styled=30\n'
