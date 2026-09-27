# 项目架构文档

## 技术栈选型

| 层级 | 选择 | 理由 |
|------|------|------|
| **前端框架** | React 18 + TypeScript | 生态成熟、Tauri 官方模板支持、招聘友好、配合 Vite 极速构建 |
| **构建工具** | Vite 5 | 开发服务器快、原生 ESM、插件生态丰富 |
| **包管理器** | pnpm 9 | 磁盘占用小、安装快、monorepo 友好 |
| **状态管理** | Zustand | 极简、无 Provider 嵌套、TypeScript 推导完美 |
| **路由** | TanStack Router | 类型安全、文件式路由、数据加载内置 |
| **UI 组件库** | Radix UI + Tailwind CSS 3 | 无样式组件库 + 原子化 CSS、体积可控、无锁定 |
| **后端 (Tauri)** | Rust 2021 + Tauri v2 | 安全、性能、系统级能力、跨平台 |
| **数据持久化** | SQLite (rusqlite / sqlx) | 零配置、文件级、支持加密、足够支撑桌面应用 |
| **IPC 通信** | Tauri Commands + Event | 类型安全的命令调用、事件总线 |
| **测试** | Vitest (前端) + cargo test (Rust) | 快速、统一配置 |
| **代码质量** | Biome (lint + format) | 极快、统一工具链、替代 ESLint + Prettier |

---

## 架构原则

1. **模块化单体** —— 功能按领域划分为独立模块，内部高内聚、低耦合，后续可平滑拆分为微服务/独立进程
2. **类型贯通** —— 前后端共享 TypeScript 类型（通过 `ts-bindgen` 或手动同步），IPC 端到端类型安全
3. **安全优先** —— 最小权限原则，CSP 严格，Rust 侧校验所有输入，前端不信任任何 IPC 返回
4. **可测试性** —— 核心逻辑与框架解耦，依赖注入 / 纯函数优先
5. **渐进增强** —— 核心功能离线可用，网络/云同步为增强

---

## 目录结构

```
├── .github/workflows/          # CI/CD
├── .husky/                     # Git hooks
├── src/                        # 前端源码 (React + TS)
│   ├── app/                    # 应用入口、路由、全局 Provider
│   ├── features/               # 业务功能模块 (按领域划分)
│   │   ├── auth/               # 认证授权
│   │   ├── settings/           # 设置
│   │   └── [feature]/          # 新功能在此新建
│   ├── shared/                 # 跨功能共享代码
│   │   ├── api/                # Tauri IPC 封装、类型定义
│   │   ├── components/         # 通用 UI 组件
│   │   ├── hooks/              # 通用 Hooks
│   │   ├── stores/             # 全局 Zustand stores
│   │   ├── styles/             # Tailwind 全局样式、CSS 变量
│   │   ├── utils/              # 工具函数
│   │   └── types/              # 共享 TypeScript 类型
│   └── main.tsx                # 入口
├── src-tauri/                  # Rust 后端 (Tauri v2)
│   ├── src/
│   │   ├── commands/           # Tauri Commands (按模块分文件)
│   │   ├── domain/             # 领域模型、业务逻辑 (纯 Rust)
│   │   │   ├── models/         # 实体、值对象
│   │   │   ├── repositories/   # 数据访问抽象
│   │   │   └── services/       # 领域服务
│   │   ├── infrastructure/     # 基础设施实现
│   │   │   ├── database/       # SQLite 连接、迁移、Repository 实现
│   │   │   ├── filesystem/     # 文件系统操作
│   │   │   ├── crypto/         # 加密、签名
│   │   │   └── network/        # HTTP 客户端、WebSocket
│   │   ├── ipc/                # 事件系统、命令注册
│   │   ├── config.rs           # 配置加载 (Figment)
│   │   ├── error.rs            # 统一错误类型
│   │   ├── lib.rs              # 库入口、模块导出
│   │   └── main.rs             # 程序入口、Tauri 初始化
│   ├── Cargo.toml
│   ├── tauri.conf.json         # Tauri 配置
│   └── build.rs                # 构建脚本 (生成类型绑定等)
├── tests/                      # 端到端测试
├── package.json
├── pnpm-workspace.yaml         # 如需 monorepo 扩展
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── biome.json                  # Biome 配置
└── README.md
```

---

## 核心模块职责

### 前端 (`src/`)

| 模块 | 职责 |
|------|------|
| `app/` | 路由配置、全局 Provider (QueryClient, StoreProvider)、启动初始化 |
| `features/[domain]/` | 单一业务功能：components、hooks、stores、api、types 内聚 |
| `shared/api/` | `invoke` 封装、类型安全的命令调用、事件监听封装 |
| `shared/stores/` | 跨功能全局状态 (用户会话、主题、窗口状态) |
| `shared/components/` | 无业务逻辑的通用 UI 组件 (Button, Dialog, Table...) |

### 后端 (`src-tauri/src/`)

| 模块 | 职责 |
|------|------|
| `commands/` | Tauri Command 入口，薄薄一层：参数校验 → 调用 Service → 返回 Result |
| `domain/` | **纯业务逻辑**，无框架依赖，可单元测试，无 IO |
| `infrastructure/` | 具体实现：数据库、文件系统、网络、加密 |
| `ipc/` | 事件发射、命令注册宏、前端类型生成 |

---

## 数据流向

```
用户交互
    │
    ▼
React Component (features/*)
    │
    ├── 读取本地状态 (Zustand) ──────────────────► 即时响应
    │
    └── 调用共享 API (shared/api/commands.ts)
            │
            ▼
    Tauri IPC (invoke / listen)
            │
            ▼
Rust Command Handler (commands/*)
            │
            ├── 参数校验、权限检查
            │
            ▼
    Domain Service (domain/services/*)
            │
            ├── 业务规则、不变量保证
            │
            ▼
    Repository Trait (domain/repositories/*)
            │
            ▼
    Infrastructure Impl (infrastructure/database/*)
            │
            ▼
    SQLite / 文件系统 / 网络
```

---

## 关键设计决策

| 决策 | 方案 | 备选 |
|------|------|------|
| **前后端类型共享** | `ts-bindgen` 自动生成 TypeScript 类型 | 手动同步 `shared/types/` |
| **数据库迁移** | `sqlx migrate` / `rusqlite-migration` | 手写 SQL 文件 + 版本表 |
| **配置管理** | Figment (TOML + 环境变量) | `config` crate |
| **错误处理** | `thiserror` 定义领域错误 → `anyhow` 传递 → Tauri 统一映射为 `InvokeError` | 直接 `anyhow` |
| **窗口管理** | Tauri `WebviewWindow` API，前端 `useWindow` Hook 封装 | 原始调用 |
| **自动更新** | Tauri Updater (GitHub Releases / 自建服务器) | 手动下载安装 |

---

## 扩展指南

### 新增业务功能
1. `src/features/[feature]/` 创建前端模块
2. `src-tauri/src/domain/` 添加领域模型、Service、Repository Trait
3. `src-tauri/src/infrastructure/` 实现 Repository
4. `src-tauri/src/commands/` 暴露 Command
5. `src/shared/api/` 添加类型安全调用封装

### 后续拆分为多进程/微服务
- `domain/` 保持不变，编译为独立 crate
- `infrastructure/` 按部署单元拆分
- `commands/` 变为 HTTP/gRPC Handler
- 前端通过统一 API Gateway 访问

---

## 开发命令

```bash
# 安装依赖
pnpm install

# 开发模式 (前端 Vite + 后端 cargo watch)
pnpm tauri dev

# 仅前端开发
pnpm dev

# 仅后端检查/测试
cd src-tauri && cargo check && cargo test

# 类型检查
pnpm typecheck

# 代码格式化 + Lint
pnpm lint && pnpm format

# 生产构建
pnpm tauri build
```

---

## 许可与贡献

- 代码风格：Biome (格式化 + Lint)，提交前自动修复
- 提交规范：Conventional Commits (`feat:`, `fix:`, `refactor:` 等)
- 分支策略：`main` 保护，功能分支 PR 合并