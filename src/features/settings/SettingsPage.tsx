import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { Card } from '@shared/components/Card'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { Label } from '@shared/components/Label'
import { Switch } from '@shared/components/Switch'
import { useThemeStore } from '@shared/stores/themeStore'
import { useWindowStore } from '@shared/stores/windowStore'

export function SettingsPage() {
  const { theme, setTheme } = useThemeStore()
  const { isMaximized, toggleMaximize, minimize, close } = useWindowStore()
  const [customName, setCustomName] = useState('')

  const handleSaveName = async () => {
    if (customName.trim()) {
      await invoke('save_user_name', { name: customName.trim() })
      setCustomName('')
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">设置</h1>

      <Card className="p-6 space-y-6">
        <h2 className="text-xl font-semibold">外观</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="theme">主题模式</Label>
              <p className="text-sm text-muted-foreground">选择应用的颜色主题</p>
            </div>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
              className="border border-input bg-background px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="light">浅色</option>
              <option value="dark">深色</option>
              <option value="system">跟随系统</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <h2 className="text-xl font-semibold">窗口控制</h2>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={minimize} disabled={isMaximized}>
            最小化
          </Button>
          <Button variant="outline" onClick={toggleMaximize}>
            {isMaximized ? '还原' : '最大化'}
          </Button>
          <Button variant="destructive" onClick={close}>
            关闭窗口
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          当前状态：{isMaximized ? '已最大化' : '正常'}
        </p>
      </Card>

      <Card className="p-6 space-y-6">
        <h2 className="text-xl font-semibold">用户资料</h2>
        <div className="flex gap-2">
          <Input
            placeholder="输入您的名称"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSaveName} disabled={!customName.trim()}>
            保存到后端
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          名称将存储在 SQLite 数据库中
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">关于</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">前端框架</dt>
            <dd>React 18 + TypeScript</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">构建工具</dt>
            <dd>Vite 5</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">后端</dt>
            <dd>Rust + Tauri v2</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">数据库</dt>
            <dd>SQLite (sqlx)</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">状态管理</dt>
            <dd>Zustand</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">路由</dt>
            <dd>TanStack Router</dd>
          </div>
        </dl>
      </Card>
    </div>
  )
}