"use client"

import * as React from "react"
import { Copy, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

type ShareModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  demoId: string
}

export function ShareModal({ open, onOpenChange, demoId }: ShareModalProps) {
  const [isLoading, setIsLoading] = React.useState(true)
  const [shareId, setShareId] = React.useState<string | null>(null)
  const [isCopied, setIsCopied] = React.useState(false)

  // Mock link generation with 1s delay
  React.useEffect(() => {
    if (open) {
      setIsLoading(true)
      setShareId(null)
      setIsCopied(false)

      const timer = setTimeout(() => {
        // Mock shareId generation (nanoid-like)
        setShareId("abc123xyz")
        setIsLoading(false)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [open, demoId])

  const shareUrl = shareId ? `https://agame.studio/play/${shareId}` : ""

  const handleCopy = async () => {
    if (!shareUrl) return

    try {
      await navigator.clipboard.writeText(shareUrl)
      setIsCopied(true)
      toast.success("Link copied")

      // Reset icon after 2s
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch {
      toast.error("Failed to copy link")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="share-modal" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share demo</DialogTitle>
          <DialogDescription>
            Send the link to colleagues. They can play and adjust parameters.
            Chat is disabled.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <>
              <Skeleton className="h-9 flex-1" />
              <Button variant="outline" size="icon" disabled>
                <Loader2 className="animate-spin" />
                <span className="sr-only">Generating link...</span>
              </Button>
            </>
          ) : (
            <>
              <Input
                data-testid="share-link"
                readOnly
                value={shareUrl}
                className="flex-1 font-mono text-sm"
                onFocus={(e) => e.target.select()}
              />
              <Button
                data-testid="share-copy"
                variant="outline"
                size="icon"
                onClick={handleCopy}
                aria-label="Copy link"
              >
                {isCopied ? <Check /> : <Copy />}
              </Button>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
