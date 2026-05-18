"use client"

import { useState } from "react"
import { ShareModal } from "@/components/share/ShareModal"
import { ExportModal } from "@/components/share/ExportModal"
import { Button } from "@/components/ui/button"
import { Share2, Download } from "lucide-react"

export default function Home() {
  const [shareOpen, setShareOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-bold">Modal Demo</h1>
      <p className="text-muted-foreground">点击下方按钮测试弹窗组件</p>
      
      <div className="flex gap-4">
        <Button onClick={() => setShareOpen(true)} size="lg">
          <Share2 className="mr-2 h-4 w-4" />
          分享游戏
        </Button>

        <Button onClick={() => setExportOpen(true)} size="lg" variant="outline">
          <Download className="mr-2 h-4 w-4" />
          导出集成包
        </Button>
      </div>

      <ShareModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        shareId="demo-game-123"
      />

      <ExportModal
        open={exportOpen}
        onOpenChange={setExportOpen}
        demoId="demo-game-123"
      />
    </main>
  )
}
