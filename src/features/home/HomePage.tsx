import { useQuery } from '@tanstack/react-query'
import { invoke } from '@tauri-apps/api/core'
import { Card } from '@shared/components/Card'
import { Button } from '@shared/components/Button'

export function HomePage() {
  const { data: greeting, isLoading } = useQuery({
    queryKey: ['greeting'],
    queryFn: () => invoke<string>('greet', { name: 'World' }),
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">欢迎使用 Tauri App</h1>
        <p className="text-muted-foreground mt-2">
          基于 React 18 + TypeScript + Tauri v2 + Rust 的现代桌面应用架构
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">后端通信测试</h2>
        {isLoading ? (
          <p className="text-muted-foreground">正在调用 Rust 后端...</p>
        ) : (
          <p className="text-foreground">{greeting}</p>
        )}
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          重新调用
        </Button>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">📦 模块化架构</h3>
          <p className="text-sm text-muted-foreground">
            功能按领域划分到 <code>src/features/</code>，高内聚低耦合
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">🔒 类型安全</h3>
          <p className="text-sm text-muted-foreground">
            前后端共享 TypeScript 类型，IPC 端到端类型检查
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">⚡ 高性能</h3>
          <p className="text-sm text-muted-foreground">
            Rust 后端 + Vite 前端，启动快、内存占用低
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">🛡️ 安全优先</h3>
          <p className="text-sm text-muted-foreground">
            最小权限原则，CSP 严格，所有输入经 Rust 校验
          </p>
        </Card>
      </div>
    </div>
  )
}