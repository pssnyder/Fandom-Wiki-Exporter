
import React from 'react';
import type { ProcessStatus } from '../types';

interface ProgressBarProps {
  current: number;
  total: number;
  message: string;
  status: ProcessStatus;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, message, status }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  const isSuccess = status === 'success';

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700 space-y-3">
      <p className="text-sm text-center text-slate-300 truncate">{message}</p>
      <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
        <div
          className={`h-4 rounded-full transition-all duration-500 ease-out ${isSuccess ? 'bg-green-500' : 'bg-cyan-500'}`}
          style={{ width: `${isSuccess ? 100 : percentage}%` }}
        ></div>
      </div>
      <p className="text-xs text-center font-mono text-slate-400">
        {current} / {total}
      </p>
    </div>
  );
};

export default ProgressBar;
