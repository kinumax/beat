# Genre Music Verification

30曲の曲選択画面にジャンル、BPM、ムードを表示し、JAZZ、POP、CLASSICAL、HIP-HOP、LO-FI、BOSSA NOVA、GUITAR、COUNTRYを割り当てた。

8つのオリジナル生成音源を45秒MP3へ変換し、`client/public/assets/`へ同梱した。曲選択時は実音源MP3を優先再生し、再生に失敗した場合はWeb Audio合成へフォールバックする。

プレビューでは、タイトル画面にジャンル付き30曲が表示され、ENTER THE STAGE押下後に`JAZZ · Rhodes · Upright Bass · Brush Kit`の音楽情報、キャラクター、譜面、4レーンが表示された。歌詞字幕は曲開始後の時間に応じてプレイ画面へ表示される。

`pnpm check`と`pnpm build`は成功している。
