import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 백엔드(Spring Boot) 연결 전까지는 /api 요청이 실패합니다. 화면에 오류로 표시됩니다.
      "/api": "http://localhost:8080",
    },
  },
});
