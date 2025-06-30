import { ImageIcon } from '@/components/image-icon';
import { OperationButton } from '@/components/ui/operation-button';
import { ImageInfo } from '@/lib/bridge/images';
import { Button } from '@heroui/button';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { Trash2 } from 'lucide-react';
import { default as prettyBytes } from 'pretty-bytes';

interface Props {
  image: ImageInfo;
  active: boolean;
  onSelect: (image: ImageInfo) => void;
}

export function ImageItem({ image: { parsedReferences, descriptors, digest }, image, active, onSelect }: Props) {
  const { name, tag, org } = parsedReferences[0];

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
      className="mb-1 flex w-full items-center justify-start px-4"
      variant={active ? 'solid' : 'light'}
      color={active ? 'primary' : 'default'}
      onPress={() => onSelect(image)}
      size="lg"
    >
      <ImageIcon name={name} org={org} digest={digest} />
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
      <div className="ml-auto flex items-center space-x-1">
        {/*<OperationButton title="View metadata" active={active} icon={Info} onClick={onViewMetadata} />*/}
        {/*<OperationButton title="Folder" active={active} icon={Folder} />*/}
        <OperationButton title="Delete" active={active} icon={Trash2} />
      </div>
    </Button>
  );
}
