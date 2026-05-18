'use client'

import * as React from 'react'
import { Download, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type ExportStatus = 'idle' | 'exporting' | 'success' | 'failed'

type ExportModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  demoId: string
}

function getStatusText(progress: number): string {
  if (progress < 40) return 'Bundling assets...'
  if (progress < 75) return 'Generating manifest...'
  return 'Finalizing...'
}

function formatDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

export function ExportModal({ open, onOpenChange, demoId }: ExportModalProps) {
  const [status, setStatus] = React.useState<ExportStatus>('idle')
  const [progress, setProgress] = React.useState(0)
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

  // Reset state when modal opens
  React.useEffect(() => {
    if (open) {
      setStatus('idle')
      setProgress(0)
    }
  }, [open])

  // Cleanup interval on unmount
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const handleStartExport = () => {
    setStatus('exporting')
    setProgress(0)

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
          setStatus('success')
          toast.success('Export complete')
          return 100
        }
        return prev + 1
      })
    }, 80)
  }

  const handleCancel = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setStatus('idle')
    setProgress(0)
  }

  const handleRetry = () => {
    handleStartExport()
  }

  const handleDownload = () => {
    // Mock download action
    toast.success('Download started')
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  // Only allow closing via Esc/overlay click when not exporting
  const handleOpenChange = (newOpen: boolean) => {
    if (status === 'exporting' && !newOpen) {
      // Prevent closing during export
      return
    }
    onOpenChange(newOpen)
  }

  const fileName = `agame-${demoId}-${formatDate()}.zip`

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        data-testid="export-modal"
        className="rounded-xl sm:max-w-md"
        showCloseButton={status !== 'exporting'}
        onEscapeKeyDown={(e) => {
          if (status === 'exporting') {
            e.preventDefault()
          }
        }}
        onPointerDownOutside={(e) => {
          if (status === 'exporting') {
            e.preventDefault()
          }
        }}
      >
        {/* Idle State */}
        {status === 'idle' && (
          <>
            <DialogHeader>
              <DialogTitle>Export integration package</DialogTitle>
              <DialogDescription>
                Download the package for integration into business runtime.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center">
              <Button
                data-testid="export-start"
                onClick={handleStartExport}
                className="w-full sm:w-auto"
              >
                Start export
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Exporting State */}
        {status === 'exporting' && (
          <>
            <DialogHeader>
              <DialogTitle>Exporting...</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3 py-2">
              <Progress data-testid="export-progress" value={progress} />
              <p className="text-muted-foreground text-sm text-center">
                {getStatusText(progress)}
              </p>
            </div>
            <DialogFooter className="sm:justify-center">
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Success State */}
        {status === 'success' && (
          <>
            <DialogHeader>
              <DialogTitle>Export complete</DialogTitle>
            </DialogHeader>
            <div className="bg-muted/50 flex flex-col gap-1 rounded-lg border px-4 py-3">
              <p className="text-foreground text-sm font-medium">{fileName}</p>
              <p className="text-muted-foreground text-sm">2.4 MB</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button data-testid="export-download" onClick={handleDownload}>
                <Download />
                Download
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Failed State */}
        {status === 'failed' && (
          <>
            <DialogHeader>
              <DialogTitle>Export failed</DialogTitle>
            </DialogHeader>
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>
                Failed to generate the export package. Please try again or
                contact support if the issue persists.
              </AlertDescription>
            </Alert>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button data-testid="export-retry" onClick={handleRetry}>
                Retry
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
