"use client"

import { useState } from "react"
import { ShareModal } from "@/components/share/ShareModal"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"

export default function Home() {
  const [open, setOpen] = useState(false)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-bold">ShareModal Demo</h1>
      <p className="text-muted-foreground">点击下方按钮测试分享弹窗</p>
      
      <Button onClick={() => setOpen(true)} size="lg">
        <Share2 className="mr-2 h-4 w-4" />
        分享游戏
      </Button>

      <ShareModal
        open={open}
        onOpenChange={setOpen}
        shareId="demo-game-123"
      />
    </main>
  )
}
