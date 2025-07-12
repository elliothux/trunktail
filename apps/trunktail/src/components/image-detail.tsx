import { MetadataPreview } from '@/components/metadata-preview';
import { ActionButton } from '@/components/ui/action-button';
import { ImageDescriptor, ImageInfo } from '@/lib/bridge/images';
import { useDisclosure } from '@heroui/modal';
import { FileBox } from 'lucide-react';
import { useState } from 'react';
import { DetailRow } from './ui/detail-row';

interface Props {
  image: ImageInfo;
}

export function ImageDetail({ image }: Props) {
  const [descriptor, setDescriptor] = useState<ImageDescriptor | null>(null);

  const disclosure = useDisclosure();

  return (
    <>
      <div className="flex flex-1 flex-col p-2.5">
        <DetailRow label="Reference" copyable>
          {image.references[0]}
        </DetailRow>
        <DetailRow label="Digest" copyable>
          {image.digest}
        </DetailRow>
        <DetailRow label="Schema Version">{image.schemaVersion}</DetailRow>
        <DetailRow label="Media Type" copyable>
          {image.mediaType}
        </DetailRow>

        <div className="mt-6">
          <div className="font-medium text-gray-400">Descriptors</div>
          <div className="mt-2 grid grid-cols-1 gap-2">
            {image.descriptors.map((item, i) => (
              <Descriptor
                key={item.descriptor.digest}
                item={item}
                onSelect={(descriptor) => {
                  setDescriptor(descriptor);
                  disclosure.onOpen();
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <MetadataPreview title="Descriptor Details" metadata={descriptor} disclosure={disclosure} />
    </>
  );
}

interface ItemProps {
  item: ImageDescriptor;
  onSelect: (item: ImageDescriptor) => void;
}

function Descriptor({ item: { descriptor }, item, onSelect }: ItemProps) {
  return (
    <ActionButton
      key={descriptor.digest}
      startContent={<FileBox className="h-5 w-5" />}
      onPress={() => {
        onSelect(item);
      }}
    >
      {descriptor.platform.os}/{descriptor.platform.architecture}{' '}
      {descriptor.platform.variant && `(${descriptor.platform.variant})`}
    </ActionButton>
  );
}
