# Vercel Audio Fix Verification

音声エンジンをAudioContextの`resume()`完了後に開始する非同期処理へ変更し、iOS Safari向けに`webkitAudioContext`フォールバックを追加した。マスターゲインを0.42へ調整し、曲開始時の音量を引き上げた。

公開準備版のプレビューでは、タイトル画面のENTER THE STAGE押下後にプレイ画面へ遷移し、4レーン、譜面バー、キャラクター、スコアHUDが表示された。`pnpm check`と`pnpm build`は成功している。

Vercelで確認する際は、今回の修正版をGitHub mainへpush後、Vercelの新しいデプロイが`Ready`になった公開URLで、ミュート解除状態のブラウザからENTER THE STAGEを一度タップする。
