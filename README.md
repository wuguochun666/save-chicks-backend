# 拯救小鸡 - 后端 API

🐥 一个用于"拯救小鸡"英语学习游戏的 Node.js/Express 后端 API。

## 功能特性

- ✅ 手机号注册/登录（带验证码）
- ✅ 游戏分数提交与排行
- ✅ 实时排行榜（Top 20）
- ✅ 管理后台（数据统计、用户管理）
- ✅ JSON 文件存储（无需数据库配置）

## API 端点

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/send-code` | 发送短信验证码（开发模式固定 1234） |
| POST | `/api/register` | 用户注册 |
| POST | `/api/login` | 用户登录 |
| POST | `/api/score` | 提交游戏分数 |
| GET | `/api/leaderboard` | 获取排行榜 |
| GET | `/api/health` | 健康检查 |

## 管理后台

- 地址：`/admin`
- 默认账号：`admin`
- 默认密码：`admin123`

## 部署

### Railway（推荐）

1. Fork 本仓库到你的 GitHub
2. 登录 [Railway](https://railway.app) 并用 GitHub 账号授权
3. 创建新项目 → 从 GitHub 仓库部署
4. 自动获取域名，无需额外配置

### 本地运行

```bash
npm install
npm start
```

服务将在 http://localhost:3000 启动

## 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `PORT` | 3000 | 服务端口 |
| `DATA_DIR` | ./data | 数据文件存放目录 |

## 技术栈

- Node.js
- Express
- bcryptjs（密码加密）
- cors（跨域支持）

## 许可证

MIT
