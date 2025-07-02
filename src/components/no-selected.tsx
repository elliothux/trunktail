import { SquareDashedMousePointer } from 'lucide-react';

export function NoSelected() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5">
      <SquareDashedMousePointer size={40} className="text-gray-300" />
      <p className="text-gray-400 text-sm">Nothing selected</p>
    </div>
  );
}
