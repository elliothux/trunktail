import { ImageDetail } from '@/components/image-detail';
import { ImageItem } from '@/components/image-item';
import { MetadataPreview } from '@/components/metadata-preview';
import { Portal } from '@/components/portal';
import { listImages } from '@/lib/bridge/images';
import { Button } from '@heroui/button';
import { useDisclosure } from '@heroui/modal';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Info } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/_app/images')({
  component: ImageList,
});

function ImageList() {
  const { data: images } = useQuery({
    queryKey: ['images'],
    queryFn: listImages,
    refetchOnMount: 'always',
  });

  const [current, setCurrent] = useState<string | null>(null);

  const disclosure = useDisclosure();

  const image = images?.find((i) => i.digest === current) ?? null;

  return (
    <>
      <Portal name="title">
        <p>Images</p>
        <p className="text-xs font-normal text-gray-400">{images?.length} images</p>
      </Portal>

      {images?.map((item) => (
        <ImageItem key={item.digest} image={item} active={current === item.digest} onSelect={setCurrent} />
      ))}

      <Portal name="right-panel-title">
        <p>Details</p>
        {image ? (
          <Button size="sm" className="ml-auto" variant="light" onPress={disclosure.onOpen} isIconOnly>
            <Info size={18} />
          </Button>
        ) : null}
      </Portal>
      <Portal name="right-panel">{image ? <ImageDetail image={image} /> : <div>No Selected</div>}</Portal>

      <MetadataPreview metadata={image} disclosure={disclosure} />
    </>
  );
}
