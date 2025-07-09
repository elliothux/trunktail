import { SquareDashedMousePointer } from 'lucide-react';

export function NoSelected() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5">
      <SquareDashedMousePointer size={40} className="text-gray-300" />
      <p className="text-sm text-gray-400">Nothing selected</p>
    </div>
  );
}
