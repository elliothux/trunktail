import { ImageDetail } from '@/components/image-detail';
import { ImageItem } from '@/components/image-item';
import { Portal } from '@/components/portal';
import { ImageInfo, listImages } from '@/lib/bridge/images';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/images/')({
  component: ImageList,
});

function ImageList() {
  const { data: images } = useQuery({
    queryKey: ['list_images'],
    queryFn: listImages,
    refetchOnMount: 'always',
  });

  const [image, setImage] = useState<ImageInfo | null>(null);
  console.log('selected', image);

  return (
    <>
      <Portal name="title">
        <p>Images</p>
        <p className="text-xs font-normal text-gray-400">{images?.length} images</p>
      </Portal>

      {images?.map((item) => <ImageItem key={item.digest} image={item} active={item === image} onSelect={setImage} />)}

      <Portal name="right-panel-title">Image Info</Portal>
      <Portal name="right-panel">{image ? <ImageDetail image={image} /> : <div>No Selected</div>}</Portal>
    </>
  );
}
