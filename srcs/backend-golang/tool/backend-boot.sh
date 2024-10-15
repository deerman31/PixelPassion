#!/bin/bash

# 最大待機時間（秒）
MAX_WAIT=300
WAIT_INTERVAL=5

echo "Waiting for MySQL to become available..."

# MySQLが利用可能になるまで待機
start_time=$(date +%s)
while ! nc -z $MYSQL_HOST $MYSQL_PORT; do
    current_time=$(date +%s)
    elapsed=$((current_time - start_time))
    
    if [ $elapsed -ge $MAX_WAIT ]; then
        echo "Timeout: MySQL did not become available within ${MAX_WAIT} seconds."
        exit 1
    fi
    
    echo "MySQL is unavailable - sleeping for ${WAIT_INTERVAL} seconds"
    sleep $WAIT_INTERVAL
done


echo "MySQL is up and running!"

# メインアプリケーションを実行
echo "Starting the main application..."
exec ./main