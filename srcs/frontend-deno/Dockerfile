FROM denoland/deno:2.0.0 AS builder

# 作業ディレクトリを設定
WORKDIR /app

#RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY deps.ts .
RUN deno cache deps.ts


COPY ./ .

RUN deno compile --allow-net --allow-env server.ts


FROM debian:bullseye-slim

ENV PORT=${FRONTEND_DENO_PORT}

# 必要なパッケージのインストールとクリーンアップ（オプション）
# セキュリティ: ca-certificatesは安全なHTTPS接続に必要です。
# 最小化: --no-install-recommendsで推奨パッケージのインストールを避けます。
# クリーンアップ: /var/lib/apt/lists/*の削除でイメージサイズを削減します。
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリを設定
WORKDIR /app

COPY --from=builder /app/server .

EXPOSE ${PORT}

CMD ["./server"]