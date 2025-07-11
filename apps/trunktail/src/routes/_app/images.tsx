import { EmptyScreen } from '@/components/empty-screen';
import { ImageDetail } from '@/components/image-detail';
import { ImageItem } from '@/components/image-item';
import { MetadataPreview } from '@/components/metadata-preview';
import { NoSelected } from '@/components/no-selected';
import { Portal } from '@/components/portal';
import { PullImage } from '@/components/pull-image';
import { listImages, loadImage, pruneImages } from '@/lib/bridge/images';
import { calcImageBytes } from '@/lib/bridge/utils';
import { Button } from '@heroui/button';
import { useDisclosure } from '@heroui/modal';
import { Tooltip } from '@heroui/tooltip';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { message, open } from '@tauri-apps/plugin-dialog';
import { FileArchive, FolderSync, HardDriveDownload, Info, Loader2, Plus } from 'lucide-react';
import { default as prettyBytes } from 'pretty-bytes';
import { useState } from 'react';
import { toast } from 'sonner';

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

  const queryClient = useQueryClient();
  const { mutate: importImage, isPending: isImporting } = useMutation({
    mutationFn: async () => {
      const path = await open({
        title: 'Import an OCI archive',
        filters: [
          {
            name: 'Image',
            extensions: ['tar'],
          },
        ],
      });
      if (!path) {
        return;
      }
      return await loadImage(path);
    },
    onSuccess: (image) => {
      if (image) {
        toast.success('Image imported');
        void queryClient.refetchQueries({ queryKey: ['images'] });
      }
    },
  });

  const { mutate: purge, isPending: isPurging } = useMutation({
    mutationFn: pruneImages,
    onSuccess: (images) => {
      if (images.length) {
        void queryClient.refetchQueries({ queryKey: ['images'] });
        const bytes = images.reduce((bytes, { descriptors }) => {
          return bytes + calcImageBytes(descriptors);
        }, 0);
        void message(`Reclaimed ${prettyBytes(bytes)} in disk space`, {
          title: `${images.length} images purged`,
        });
      } else {
        toast.success('No images to purge');
      }
    },
  });

  const metadataDisclosure = useDisclosure();
  const pullImageDisclosure = useDisclosure();

  const image = images?.find((i) => i.digest === current) ?? null;

  return (
    <>
      <Portal name="title">
        <div className="flex w-full items-center justify-between gap-3" data-tauri-drag-region>
          <div className="pointer-events-none mr-auto select-none">
            <p className="pointer-events-none select-none">Images</p>
            <p className="pointer-events-none text-xs font-normal text-gray-400 select-none">{images?.length} images</p>
          </div>
          <Tooltip className="text-white" content="Purge unreferenced images">
            <Button
              size="sm"
              variant="light"
              className="text-neutral-400 hover:text-white"
              onPress={() => purge()}
              isIconOnly
            >
              {isPurging ? <Loader2 className="animate-spin" size={18} /> : <FolderSync size={18} />}
            </Button>
          </Tooltip>
          <Tooltip className="text-white" content="Import an OCI archieve">
            <Button
              size="sm"
              variant="light"
              className="text-neutral-400 hover:text-white"
              onPress={() => importImage()}
              isIconOnly
            >
              {isImporting ? <Loader2 className="animate-spin" size={18} /> : <HardDriveDownload size={18} />}
            </Button>
          </Tooltip>
          <Tooltip className="text-white" content="Pull an image">
            <Button size="sm" variant="flat" className="text-white" onPress={pullImageDisclosure.onOpen} isIconOnly>
              <Plus size={18} />
            </Button>
          </Tooltip>
        </div>
      </Portal>

      {images?.length ? (
        images?.map((item) => (
          <ImageItem key={item.digest} image={item} active={current === item.digest} onSelect={setCurrent} />
        ))
      ) : (
        <EmptyScreen icon={FileArchive} loading={images == null}>
          No images
        </EmptyScreen>
      )}

      <Portal name="right-panel-title">
        <p>Details</p>
        {image ? (
          <Button
            size="sm"
            className="ml-auto text-gray-200"
            variant="light"
            onPress={metadataDisclosure.onOpen}
            isIconOnly
          >
            <Info size={18} />
          </Button>
        ) : null}
      </Portal>
      <Portal name="right-panel">{image ? <ImageDetail image={image} /> : <NoSelected />}</Portal>

      <MetadataPreview title="Image Metadata" metadata={image} disclosure={metadataDisclosure} />
      <PullImage disclosure={pullImageDisclosure} />
    </>
  );
}
