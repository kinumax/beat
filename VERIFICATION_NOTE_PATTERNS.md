# Note Pattern Verification

譜面型にstandard、long、zigzag、slide、stair、burst、double、sweep、pulse、ghostの10パターンを追加した。

長押しノーツはdurationの違いを持ち、zigzag・slide・sweepはpath配列で複数レーンを定義する。描画ではpath終点へ向かう曲線と、zigzag／sweepのうねり、slideの揺れを表示する。Pointer Eventsのpointer captureとlane-pad-rowのpointermoveで、押下中の指移動を判定エンジンへ渡す。

390×844のモバイルタイトル画面、30曲選択UI、4レーン入力面を確認した。`pnpm check`と`pnpm build`は成功している。

プレビューのプレイ画面で、複数レーンを結ぶ曲線バー、終点リング、異なる長さのホールドバーが確認できた。キャラクター、4レーン、判定ゲートも既存の一点透視構成を維持している。
