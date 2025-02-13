# Find One! 

[English](README.md) | [繁體中文](TRADITIONAL_README.md)

**Find One!** 是一款透過 TensorFlow.js 和 MobileNet 實現的即時偵測遊戲。在此遊戲中，玩家必須在指定時間內於攝影機前秀出題目所指定的物品（例如：手機、衣服、鉛筆等等）。

---

## 功能特色

- **即時物件偵測：** 利用 TensorFlow.js 與 MobileNet 對攝影機畫面進行即時分析。
---

## 安裝說明

1. **Clone the Repository**
   ```bash
   git clone https://github.com/viiccwen/findone.git
   cd findone
   ```
2. **Download Dependencies:**
   ```bash
   pnpm install
   ```
3. **sStart the Server (Development Mode):**
   ```bash
   pnpm dev
   ```
4. **開啟 [http://localhost:3000](http://localhost:3000)**

---

## 使用技術

- **Next.js 與 TypeScript：** 框架
- **shadcn UI：** UI 套件
- **Zustand：** 狀態管理
- **TensorFlow.js 與 MobileNet：** 透過 AI 實現前端即時物件偵測

---

## 授權條款

此專案採用 MIT 授權條款。