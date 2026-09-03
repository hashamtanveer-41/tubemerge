import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { CheckCircle2, Play, FolderOpen } from 'lucide-react';

interface SuccessModalProps {
  outputFile: string;
  onReset: () => void;
}

export function SuccessModal({ outputFile, onReset }: SuccessModalProps) {
  const [openingFile, setOpeningFile] = useState(false);
  const [openingFolder, setOpeningFolder] = useState(false);

  const filename = outputFile.split('/').pop() || outputFile;

  const handleOpenFile = async () => {
    setOpeningFile(true);
    try {
      await api.openFile(outputFile);
    } catch (err: any) {
      alert(err.message || 'Could not open file');
    } finally {
      setOpeningFile(false);
    }
  };

  const handleOpenFolder = async () => {
    setOpeningFolder(true);
    try {
      await api.openFolder(outputFile);
    } catch (err: any) {
      alert(err.message || 'Could not open folder');
    } finally {
      setOpeningFolder(false);
    }
  };

  return (
    <Card className="p-8 max-w-xl mx-auto flex flex-col items-center text-center space-y-6 border-stroke-hover bg-theme-surface shadow-2xl select-none animate-in zoom-in-95 duration-200">
      <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
        <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-black text-content-primary">Merge Complete!</h2>
        <p className="text-sm text-content-muted">
          Your selected clips were standardized and stitched with chapter markers.
        </p>
      </div>

      {/* Output File Pill */}
      <div className="bg-theme-panel border border-stroke-card px-4 py-2 rounded-xl text-xs font-mono text-content-secondary max-w-md truncate">
        {filename}
      </div>

      {/* Native Desktop Actions */}
      <div className="flex items-center gap-3 w-full justify-center">
        <Button
          variant="default"
          size="default"
          onClick={handleOpenFile}
          loading={openingFile}
          icon={Play}
          className="min-w-[140px]"
        >
          Open File
        </Button>

        <Button
          variant="secondary"
          size="default"
          onClick={handleOpenFolder}
          loading={openingFolder}
          icon={FolderOpen}
          className="min-w-[140px]"
        >
          Open Folder
        </Button>
      </div>

      <button
        onClick={onReset}
        className="text-xs text-content-dim hover:text-content-primary underline cursor-pointer transition-colors"
      >
        Start New Merge
      </button>
    </Card>
  );
}
