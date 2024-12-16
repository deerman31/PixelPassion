# ビルドステージ
FROM golang:1.23.2-bullseye AS builder

# 作業ディレクトリを設定
WORKDIR /app

# 必要なビルドツールをインストール
# 注意: 現在のビルドプロセスでgitが必要ない場合は、この行を削除してイメージサイズを削減できます
# gitが必要な理由：
# 1. 一部のGoパッケージがgitリポジトリから直接取得される場合がある
# 2. ビルド時にgitからバージョン情報を取得する可能性がある
# 3. プライベートgitリポジトリにあるパッケージにアクセスする必要がある場合
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# 依存関係ファイルをコピー
# このステップを分離する理由：
# 1. ビルドキャッシュの最適化: 依存関係が変更されていない場合、次のステップがキャッシュされる
# 2. ビルド時間の短縮: ソースコードのみの変更の場合、依存関係のダウンロードをスキップできる
# 3. 問題の特定が容易: 依存関係の解決とソースコードのビルドを分離
COPY ./go.mod ./go.sum ./

# 依存関係をダウンロード
# このステップは、go.modとgo.sumが変更されていない場合、キャッシュされる
RUN go mod download

# ソースコードをコピー
# 注意: 前のステップで既にgo.modとgo.sumをコピーしているが、
# これは意図的な重複です。この方法により、ソースコードの変更のみの場合に
# 依存関係のダウンロードをスキップしてビルド時間を短縮できます
COPY ./ .

# アプリケーションをビルド
# CGO_ENABLED=0: 静的リンクのバイナリを生成し、外部依存を減らす
# GOOS=linux: Linux用のバイナリを生成（クロスコンパイル）
# -a: すべてのパッケージを再ビルド
# -installsuffix cgo: CGOを無効にしたビルドの結果を分離
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .


# 実行ステージ
# 実行ステージであるため、golangのイメージをベースにする必要はない
FROM debian:bullseye-slim

ENV PORT=${BACKEND_GOLANG_PORT}

# 必要なパッケージのインストールとクリーンアップ（オプション）
# セキュリティ: ca-certificatesは安全なHTTPS接続に必要です。
# 最小化: --no-install-recommendsで推奨パッケージのインストールを避けます。
# クリーンアップ: /var/lib/apt/lists/*の削除でイメージサイズを削減します。
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# セキュリティのために非root ユーザーを作成
# 目的: セキュリティ強化のために、特権のない専用ユーザーを作成します。
# セキュリティ: rootでアプリケーションを実行するリスクを軽減します。
# 最小権限の原則: アプリケーションに必要最小限の権限のみを与えます。
# 詳細: -mオプションでホームディレクトリを作成します。
RUN useradd -m appuser

# 作業ディレクトリを設定
WORKDIR /app

# ビルドステージからバイナリをコピー
# 目的: ビルドステージで作成されたバイナリを実行環境にコピーします。
# 最小化: ビルド環境の依存関係を含めずに、実行可能ファイルのみをコピーします。
# マルチステージビルド: --from=builderで前段階の成果物を参照します。
COPY --from=builder /app/main .


#COPY ./tool/backend-boot.sh .
COPY --from=builder /app/tool/backend-boot.sh .
#COPY --from=builder /app/tool/backend-boot.sh .
RUN chmod +x backend-boot.sh

# 非root ユーザーに切り替え
USER appuser

# /app/uploads/images
RUN mkdir -p /home/appuser/uploads/images
RUN mkdir -p /home/appuser/uploads/images/default_image
COPY ./default_image/napoleon.png /home/appuser/uploads/images/default_image

#EXPOSE 3000
EXPOSE ${PORT}

# コンテナ起動時に実行されるコマンド
#CMD ["./main"]
CMD ["./backend-boot.sh"]