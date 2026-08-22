#!/usr/bin/env bash
set -euo pipefail
OUT=/home/ubuntu/neon-beat-star/client/public/assets
mkdir -p "$OUT"
seeds=(
  /home/ubuntu/webdev-static-assets/track-jazz.wav
  /home/ubuntu/webdev-static-assets/track-pop.wav
  /home/ubuntu/webdev-static-assets/track-hiphop.wav
  /home/ubuntu/webdev-static-assets/track-guitar.wav
  /home/ubuntu/webdev-static-assets/track-bossa.wav
  /home/ubuntu/webdev-static-assets/track-lofi.wav
  /home/ubuntu/webdev-static-assets/track-classical.wav
  /home/ubuntu/webdev-static-assets/track-country.wav
  /home/ubuntu/webdev-static-assets/track-09-blue-comet.wav
  /home/ubuntu/webdev-static-assets/track-10-night-bus.wav
  /home/ubuntu/webdev-static-assets/track-11-prism-runner.wav
  /home/ubuntu/webdev-static-assets/track-12-low-gravity.wav
)
for i in $(seq 1 30); do
  seed_index=$(( (i - 1) % ${#seeds[@]} ))
  seed=${seeds[$seed_index]}
  tempo=$(awk "BEGIN { printf \"%.4f\", 0.92 + (($i * 7) % 17) / 100 }" )
  pitch=$(awk "BEGIN { printf \"%.4f\", 0.97 + (($i * 5) % 9) / 100 }" )
  vol=$(awk "BEGIN { printf \"%.2f\", 0.74 + (($i * 3) % 18) / 100 }" )
  cutoff=$((2200 + (i * 173) % 2600))
  delay=$(awk "BEGIN { printf \"%.2f\", 0.08 + ($i % 4) * 0.04 }")
  filter="[0:a]asetrate=44100*${pitch},aresample=44100,atempo=${tempo},highpass=f=38,lowpass=f=${cutoff},volume=${vol},aecho=0.8:0.7:60:${delay}[a]"
  ffmpeg -y -hide_banner -loglevel error -i "$seed" -t 45 -filter_complex "$filter" -map "[a]" -codec:a libmp3lame -b:a 64k "$OUT/track-$(printf '%02d' "$i").mp3"
done
