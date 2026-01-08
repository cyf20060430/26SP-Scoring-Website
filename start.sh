#!/bin/bash

# 启动后端
echo "启动后端服务..."
cd server
node index.js &
BACKEND_PID=$!

# 启动前端
echo "启动前端服务..."
cd ../frontend   # 如果你用的是 client 就改成 client
npm start &

# 等待用户按 Ctrl+C 停止
trap "kill $BACKEND_PID" EXIT
wait
