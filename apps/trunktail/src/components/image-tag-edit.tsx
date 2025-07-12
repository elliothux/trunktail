import { OperationButton } from '@/components/ui/operation-button';
import { deleteImages, ImageReference, tagImage } from '@/lib/bridge/images';
import { stringifyImageReference } from '@/lib/bridge/utils';
import { Button } from '@heroui/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/modal';
import type { UseDisclosureReturn } from '@heroui/use-disclosure';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  references: ImageReference[];
  disclosure: UseDisclosureReturn;
}

export function ImageTagEdit({ references, disclosure: { isOpen, onOpenChange } }: Props) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={false}>
      <ModalContent>{(onClose) => <EditList references={references} onClose={onClose} />}</ModalContent>
    </Modal>
  );
}

function EditList({
  references,
  onClose,
}: Pick<Props, 'references'> & {
  onClose: () => void;
}) {
  const initTags = () => references.map((ref) => ref.tag).sort((a, b) => a.localeCompare(b));
  const [tags, setTags] = useState<string[]>(initTags);
  const [editing, setEditing] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const { mutate: save, isPending } = useMutation({
    mutationFn: async () => {
      const newTags = Array.from(new Set(tags.filter((tag) => tag.trim() !== '')).values()).sort((a, b) =>
        a.localeCompare(b),
      );
      if (newTags.length === 0) {
        return { add: [], remove: [] };
      }
      const lastTags = initTags();
      if (newTags.join(',') === lastTags.join(',')) {
        return { add: [], remove: [] };
      }

      const add: string[] = [];
      const remove: string[] = [];
      for (const tag of newTags) {
        if (!lastTags.includes(tag)) {
          add.push(tag);
        }
      }
      for (const tag of lastTags) {
        if (!newTags.includes(tag)) {
          remove.push(tag);
        }
      }

      const [reference] = references;
      if (!reference) {
        throw new Error('No reference found');
      }
      const source = stringifyImageReference(reference);
      if (add.length) {
        await Promise.all(
          add.map((tag) =>
            tagImage({
              source,
              target: stringifyImageReference({ ...reference, tag }),
            }),
          ),
        );
      }
      if (remove.length) {
        await deleteImages(remove.map((tag) => stringifyImageReference({ ...reference, tag })));
      }
      return {
        add,
        remove,
      };
    },
    onMutate: () => {
      setEditing(null);
    },
    onSuccess: ({ add, remove }) => {
      if (add.length || remove.length) {
        toast.success('Tags updated');
        void queryClient
          .refetchQueries({ queryKey: ['images'] })
          .then((i) => {
            console.log('refetched', i);
          })
          .catch((e) => {
            console.error('refetch error', e);
          });
      }
      onClose();
    },
  });

  return (
    <>
      <ModalHeader className="flex flex-col gap-1 text-white">Edit Tags</ModalHeader>
      <ModalBody className="gap-y-2 text-sm">
        {tags.map((tag, index) => {
          const isEditing = editing === index;
          return (
            <div
              key={index}
              className="hover:bg-muted bg-background/60 flex items-center justify-start gap-1 rounded-lg px-3 py-1 text-white"
            >
              {isEditing ? (
                <input
                  value={tag}
                  onChange={(e) => {
                    if (!/^[A-Za-z0-9_.-]*$/.test(e.target.value)) {
                      return;
                    }
                    setTags((prev) => {
                      const newTags = [...prev];
                      newTags[index] = e.target.value;
                      return newTags;
                    });
                  }}
                  className="placeholder:text-darkgray shrink grow text-white"
                  placeholder="Enter tag"
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  autoSave="off"
                  autoFocus
                />
              ) : (
                <p className="shrink grow">{tag}</p>
              )}
              {isEditing ? (
                <OperationButton
                  title="Save"
                  active={false}
                  icon={Check}
                  onClick={() => {
                    if (tag.trim() === '') {
                      return;
                    }
                    setEditing(null);
                  }}
                  disabled={isPending}
                />
              ) : (
                <OperationButton
                  title="Edit"
                  active={false}
                  icon={Edit}
                  onClick={() => setEditing(index)}
                  disabled={isPending}
                />
              )}
              <OperationButton
                title="Delete"
                active={false}
                icon={Trash2}
                onClick={() => {
                  setTags((prev) => prev.filter((_, i) => i !== index));
                }}
                disabled={isPending}
              />
            </div>
          );
        })}
      </ModalBody>
      <ModalFooter>
        <Button
          variant="flat"
          onPress={() => {
            setTags((prev) => [...prev, '']);
            setEditing(tags.length);
          }}
          className="mr-auto"
          startContent={<Plus size={16} />}
          disabled={isPending}
        >
          Add
        </Button>
        <Button color="danger" variant="light" onPress={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button color="primary" onPress={() => save()} isLoading={isPending}>
          Save
        </Button>
      </ModalFooter>
    </>
  );
}
