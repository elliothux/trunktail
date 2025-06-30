import { deleteImages, ImageInfo, saveImage } from '@/lib/bridge/images';
import { calcImageSize } from '@/lib/bridge/utils';
import { openPathWithFinder } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { confirm, message, save } from '@tauri-apps/plugin-dialog';
import { default as prettyBytes } from 'pretty-bytes';
import { useCallback } from 'react';
import { toast } from 'sonner';

export function useImageOperations({ references, descriptors, digest, isInfra, references: [reference] }: ImageInfo) {
  const queryClient = useQueryClient();
  const { mutate: onDelete, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteImages(references),
    onSuccess: () => {
      toast.success('Images deleted');
      void queryClient.setQueryData(['images'], (images: ImageInfo[]) => images.filter((i) => i.digest !== digest));
    },
    onError: (e: unknown) => {
      void message(e == null ? 'Unknown error' : e instanceof Error ? e.message : e.toString(), {
        kind: 'warning',
        title: 'Failed to delete container',
      });
    },
  });

  const { mutate: onExport, isPending: isExporting } = useMutation({
    mutationFn: async () => {
      const path = await save({
        title: 'Save as an OCI archive',
        canCreateDirectories: true,
        defaultPath: `~/Downloads/${reference.replaceAll('/', '_').replaceAll(':', '~')}.tar`,
      });
      if (!path) {
        return;
      }
      await saveImage({
        reference,
        output: path,
      });
      return path;
    },
    onSuccess: async (path) => {
      if (!path) {
        return;
      }
      const viewInFinder = await confirm(`Saved at ${path}`, {
        title: 'Image saved',
        kind: 'info',
        okLabel: 'View in Finder',
      });
      if (viewInFinder) {
        void openPathWithFinder(path);
      }
    },
  });

  const onDeleteConfirm = useCallback(async () => {
    if (isInfra) {
      return;
    }
    confirm('Are you sure you want to delete this image?', {
      title: 'Delete image',
      kind: 'error',
    }).then((result) => {
      if (result) {
        onDelete();
      }
    });
  }, [onDelete]);

  const size = prettyBytes(calcImageSize(descriptors));
  const createdAt = descriptors[0]?.config.created ?? 'N/A';

  return {
    onDeleteConfirm,
    onExport,
    isDeleting,
    isExporting,
    size,
    createdAt,
  };
}
