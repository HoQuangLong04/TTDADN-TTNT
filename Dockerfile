# Sử dụng Node.js LTS
FROM node:18

# Tạo thư mục app
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install || (echo "npm install failed" && cat /app/npm-debug.log && exit 1)

# Copy toàn bộ mã nguồn vào container
COPY . .

# Mở cổng (thay 3000 bằng cổng app bạn dùng nếu khác)
EXPOSE 3000

# Lệnh chạy app
CMD ["npm", "start"]
