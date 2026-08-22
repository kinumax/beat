#!/usr/bin/env bash
set -euo pipefail
mkdir -p /home/ubuntu/neon-beat-star/client/public/assets
for genre in jazz pop classical hiphop lofi bossa guitar country; do
  ffmpeg -y -hide_banner -loglevel error -i "/home/ubuntu/webdev-static-assets/track-${genre}.wav" -t 45 -codec:a libmp3lame -b:a 64k "/home/ubuntu/neon-beat-star/client/public/assets/track-${genre}.mp3"
done
