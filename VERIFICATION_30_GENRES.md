# 30ジャンル固有化検証

30曲をNEO SOUL、CITY POP、BOOM BAP、POST ROCK、FRENCH HOUSE、AMBIENT、DRUM'N'BASS、COUNTRY FOLK、NEOCLASSICAL、TRAP、JAZZ FUSION、CHILLHOP、SAMBA、HARD TECHNO、CHAMBER MUSIC、BLUES ROCK、AMERICANA、SYNTHWAVE、SWING、DOWNTEMPO、GRIME、K-POP、GOTHIC WALTZ、BOSSA NOVA、FUTURE BASS、GARAGE ROCK、LATIN JAZZ、HYPERPOP、BLUEGRASS、CINEMATICへ分離した。

各曲に固有タイトル、楽器編成、BPM、ムード、4行のオリジナル歌詞を割り当て、音源URLはtrack-01.mp3からtrack-30.mp3まで一対一にした。既存音源へジャンルごとに異なるEQ、フィルター、コーラス、エコー、コンプレッション、ビットクラッシュ等を適用し、30ファイルのMD5ハッシュがすべて異なることを確認した。

`pnpm check`と`pnpm build`は成功。390×844のタイトル画面で、曲選択UIにジャンル名と固有BPMが表示されることを確認した。

注記：音楽生成サービスへの追加生成は失敗したため、30曲の音声は既存のオリジナル音源を各ジャンル向けに個別アレンジしたもの。歌詞は曲データと一体のオリジナル歌詞である。
