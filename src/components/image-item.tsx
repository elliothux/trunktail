import { ImageInfo } from '@/lib/bridge/images';
import { cn } from '@/lib/utils';
import { Button } from '@heroui/button';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { Folder, Trash2 } from 'lucide-react';
import { default as prettyBytes } from 'pretty-bytes';

interface Props {
  image: ImageInfo;
  active: boolean;
  onSelect: (image: ImageInfo) => void;
}

export function ImageItem({ image: { reference, descriptors }, image, active, onSelect }: Props) {
  const [name, tag] = reference.split(':');

  const size = prettyBytes(
    descriptors.reduce(
      (acc, { descriptor, manifest }) =>
        acc + descriptor.size + manifest.config.size + manifest.layers.reduce((acc, layer) => acc + layer.size, 0),
      0,
    ),
  );

  const createdAt = descriptors[0]?.config.created ?? 'N/A';

  return (
    <Button
      as="section"
      className="mb-1 flex w-full items-center justify-between px-4"
      variant={active ? 'solid' : 'light'}
      color={active ? 'primary' : 'default'}
      onPress={() => onSelect(image)}
      size="lg"
    >
      <div>
        <p className="text-sm">
          {name}:<span className="text-muted-foreground">{tag}</span>
        </p>
        <p className="text-muted-foreground text-xs opacity-80">
          <span>{size}</span>
          {createdAt !== 'N/A' && (
            <span>, created {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
          )}
        </p>
      </div>
      <div className="flex items-center space-x-1">
        <Button size="sm" variant="light" isIconOnly>
          <Folder className={cn('h-4 w-4', active ? 'text-white' : 'text-gray-900')} />
        </Button>
        <Button size="sm" variant="light" isIconOnly>
          <Trash2 className={cn('h-4 w-4', active ? 'text-white' : 'text-gray-900')} />
        </Button>
      </div>
    </Button>
  );
}
