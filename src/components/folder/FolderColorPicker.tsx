import React from 'react';
import { cn } from '@/lib/utils';

interface FolderColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const FOLDER_COLORS = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Lime', value: '#84cc16' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Fuchsia', value: '#d946ef' },
  { name: 'Pink', value: '#ec4899' },
];

const FolderColorPicker: React.FC<FolderColorPickerProps> = ({
  selectedColor,
  onColorSelect,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Select Folder Color</h3>
      <div className="grid grid-cols-4 gap-2">
        {FOLDER_COLORS.map((color) => (
          <button
            key={color.value}
            onClick={(e) => {
              e.preventDefault();
              onColorSelect(color.value);
            }}
            className={cn(
              'relative w-full h-8 rounded-lg transition-all duration-200',
              'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500',
              selectedColor === color.value && 'ring-2 ring-offset-2 ring-purple-500'
            )}
            style={{ backgroundColor: color.value }}
            title={color.name}
            type="button"
          >
            {selectedColor === color.value && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FolderColorPicker; 