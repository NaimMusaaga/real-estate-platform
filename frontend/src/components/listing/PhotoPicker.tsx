import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';

// Mirrors the backend upload limits (upload.middleware.js / env.js) so users get
// feedback immediately instead of after a round trip.
export const MAX_PHOTOS = 8;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface PhotoPickerProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export function PhotoPicker({ files, onChange }: PhotoPickerProps) {
  const [error, setError] = useState('');

  const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);
  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews]);

  function handleSelect(e: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (picked.length === 0) return;

    const problems: string[] = [];
    const valid = picked.filter((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        problems.push(`"${file.name}" ليست بصيغة JPG أو PNG أو WEBP`);
        return false;
      }
      if (file.size > MAX_FILE_BYTES) {
        problems.push(`"${file.name}" أكبر من 5MB`);
        return false;
      }
      return true;
    });

    const room = MAX_PHOTOS - files.length;
    if (valid.length > room) {
      problems.push(`الحد الأقصى ${MAX_PHOTOS} صور — تم تجاهل الزائد`);
    }

    setError(problems.join('، '));
    if (valid.length > 0) onChange([...files, ...valid.slice(0, room)]);
  }

  function handleRemove(index: number) {
    setError('');
    onChange(files.filter((_, i) => i !== index));
  }

  const canAddMore = files.length < MAX_PHOTOS;

  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="text-sm font-medium text-stone-700">
          صور العقار <span className="text-red-600">*</span>
        </p>
        <p className="text-xs text-stone-500">
          أضف صورة واحدة على الأقل، ويمكنك إضافة حتى {MAX_PHOTOS} صور (JPG / PNG / WEBP، حتى 5MB للصورة). الصورة الأولى تظهر كغلاف الإعلان.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {previews.map((url, index) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-xl bg-stone-100">
            <img src={url} alt={`صورة ${index + 1}`} className="h-full w-full object-cover" />
            {index === 0 && (
              <span className="absolute start-1.5 top-1.5 rounded-full bg-brand-800/90 px-2 py-0.5 text-[10px] font-semibold text-white">
                الغلاف
              </span>
            )}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              aria-label={`حذف الصورة ${index + 1}`}
              className="absolute end-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-stone-900/70 text-white transition-colors hover:bg-red-600 focus-visible:ring-2 focus-visible:ring-white"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}

        {canAddMore && (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-stone-300 text-xs font-semibold text-stone-500 transition-colors hover:border-brand-400 hover:text-brand-600 focus-within:ring-2 focus-within:ring-brand-600">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            إضافة صور ({files.length}/{MAX_PHOTOS})
            <input
              type="file"
              accept={ACCEPTED_TYPES.join(',')}
              multiple
              className="sr-only"
              onChange={handleSelect}
            />
          </label>
        )}
      </div>

      {error && (
        <p role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
      {files.length === 0 && !error && <p className="text-xs font-medium text-amber-700">مطلوب صورة واحدة على الأقل للمتابعة.</p>}
    </div>
  );
}
