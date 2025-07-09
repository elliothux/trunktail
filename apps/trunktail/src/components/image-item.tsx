import { ImageIcon } from '@/components/image-icon';
import { ImageTagEdit } from '@/components/image-tag-edit';
import { OperationButton } from '@/components/ui/operation-button';
import { useImageOperations } from '@/hooks/use-image-operations';
import { ImageInfo } from '@/lib/bridge/images';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { useDisclosure } from '@heroui/modal';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { FileDown, Tag, Trash2 } from 'lucide-react';

interface Props {
  image: ImageInfo;
  active: boolean;
  onSelect: (digest: string) => void;
}

export function ImageItem({ image: { parsedReferences, digest, isInfra }, image, active, onSelect }: Props) {
  const { name, org } = parsedReferences[0];
  const { onDeleteConfirm, isDeleting, onExport, isExporting, size, createdAt } = useImageOperations(image);

  const tagsDisclosure = useDisclosure();

  return (
    <>
      <Button
        as="section"
        className="mb-1 flex w-full items-center justify-start px-4"
        variant={active ? 'solid' : 'light'}
        color={active ? 'primary' : 'default'}
        onPress={() => onSelect(image.digest)}
        size="lg"
      >
        <ImageIcon name={name} org={org} digest={digest} />
        <div>
          <div className="flex flex-row items-center justify-start">
            <p className="mr-2 text-sm">
              {org ? <span className="opacity-40">{org}/</span> : null}
              <span>{name}</span>
            </p>
            {parsedReferences.map((i) => (
              <Chip
                key={i.tag}
                size="sm"
                className="mr-1 min-w-6 px-0.5 py-0 text-xs"
                variant={active ? 'solid' : 'flat'}
                style={{
                  height: 16,
                  minHeight: 16,
                  maxHeight: 16,
                }}
              >
                {i.tag}
              </Chip>
            ))}
          </div>
          <p className="text-xs opacity-70">
            <span>{size}</span>
            {createdAt !== 'N/A' && (
              <span>, created {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
            )}
          </p>
        </div>
        <div className="ml-auto flex items-center space-x-1">
          <OperationButton title="Tags" active={active} icon={Tag} onClick={tagsDisclosure.onOpen} />
          <OperationButton
            title="Export as OCI archive"
            active={active}
            icon={FileDown}
            onClick={onExport}
            isLoading={isExporting}
          />
          <OperationButton
            title="Delete"
            active={active}
            icon={Trash2}
            onClick={onDeleteConfirm}
            isLoading={isDeleting}
            disabled={isInfra}
          />
        </div>
      </Button>
      <ImageTagEdit references={parsedReferences} disclosure={tagsDisclosure} />
    </>
  );
}
