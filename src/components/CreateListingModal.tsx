'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, Camera, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { NewListingInput } from '@/types/listing';
import { compressImage } from '@/lib/image-compress';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewListingInput) => Promise<void>;
}

export function CreateListingModal({ isOpen, onClose, onSubmit }: CreateListingModalProps) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Csak képfájl tölthető fel!');
      return;
    }

    try {
      setIsCompressing(true);
      setError(null);
      const compressedDataUrl = await compressImage(file, 960, 0.75);
      setImageUrl(compressedDataUrl);
    } catch (err) {
      console.error(err);
      setError('Hiba történt a kép feldolgozásakor.');
    } finally {
      setIsCompressing(false);
    }
  }

  function handleRemoveImage() {
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Add meg a termék nevét!');
      return;
    }

    if (!room.trim()) {
      setError('Add meg a szobaszámodat (pl. 312 vagy B204)!');
      return;
    }

    const parsedPrice = parseInt(price.replace(/\D/g, ''), 10) || 0;

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        price: parsedPrice,
        room: room.trim(),
        description: description.trim(),
        image_url: imageUrl,
      });

      // Reset state
      setTitle('');
      setPrice('');
      setRoom('');
      setDescription('');
      setImageUrl('');
      onClose();
    } catch (err) {
      console.error(err);
      setError('Nem sikerült elmenteni a hirdetést. Kérlek próbáld újra!');
    } finally {
      setIsSubmitting(false);
    }
  }

  const numericPrice = parseInt(price.replace(/\D/g, ''), 10) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Új hirdetés feladása
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Add meg az alap adatokat, és a kolistársaid már látják is.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Termék neve */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Termék neve <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="pl. Szarvasi kávéfőző, Forgószék, Tankönyv..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all placeholder:text-zinc-400"
            />
          </div>

          {/* Ár és Szobaszám egy sorban */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ár */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Ár (Ft) <span className="text-red-500">*</span>
                </label>
                {numericPrice === 0 && price.length > 0 && (
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    Ingyen elvihető!
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="pl. 3500 (0 = ingyen)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all placeholder:text-zinc-400 pr-10"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-medium text-zinc-400">
                  Ft
                </span>
              </div>
            </div>

            {/* Szobaszám */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Szobaszám <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="pl. 312 vagy B204"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all placeholder:text-zinc-400"
              />
            </div>
          </div>

          {/* Leírás */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Rövid leírás <span className="text-zinc-400 font-normal">(opcionális)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Állapot, miért adod el, mikor vehető át a szobádban..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all placeholder:text-zinc-400 resize-none"
            />
          </div>

          {/* Képfeltöltés */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Fotó a cuccról <span className="text-zinc-400 font-normal">(opcionális)</span>
            </label>

            {imageUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 max-h-48 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Előnézet"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white text-xs font-medium backdrop-blur-sm transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-zinc-50/50 dark:bg-zinc-800/30 transition-colors"
              >
                {isCompressing ? (
                  <div className="flex flex-col items-center gap-2 text-zinc-500 py-2">
                    <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                    <span className="text-xs">Kép optimalizálása...</span>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Kattints ide fotó készítéséhez vagy feltöltéséhez
                      </span>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Mobilról egyből kamerával is lőhetsz egy képet
                      </p>
                    </div>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Mégse
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isCompressing}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 shadow-md active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mentés...</span>
                </>
              ) : (
                <span>Hirdetés közzététele</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

