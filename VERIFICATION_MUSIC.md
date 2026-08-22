# Music Catalog Verification

タイトル画面のDOMに30曲すべてが表示され、各曲に固有の曲名、BPM、ムードが設定されている。モバイル幅390pxでは曲選択パネルが2列のスクロール領域として表示され、難易度とENTER THE STAGEを圧迫しない。

曲選択後にENTER THE STAGEを押すと、プレイ画面へ遷移し、選択曲に対応した譜面バー、スコアHUD、4レーン、オリジナルキャラクターが表示された。音声はユーザーの開始操作後にAudioContextをresumeし、選択曲のBPMに合わせたオリジナル合成BGMを開始する実装へ変更した。

`pnpm check`と`pnpm build`は成功した。
