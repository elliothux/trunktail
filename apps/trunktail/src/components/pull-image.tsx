import { cn } from '@/lib/utils';
import { createCommand } from '@/utils';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/modal';
import type { UseDisclosureReturn } from '@heroui/use-disclosure';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from '@tauri-apps/plugin-dialog';
import { Child, TerminatedPayload } from '@tauri-apps/plugin-shell';
import { Download, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  disclosure: UseDisclosureReturn;
}

export function PullImage({ disclosure: { isOpen, onOpenChange, onClose } }: Props) {
  const [image, setImage] = useState<string>('');
  const [log, setLog] = useState<{ line: string; type: 'stdout' | 'stderr' } | null>(null);

  const updateLog = useCallback((line: string, type: 'stdout' | 'stderr') => {
    const text = line.replaceAll('\r', '').trim();
    if (text.length === 0) {
      return;
    }
    setLog({ line: text, type });
  }, []);

  const processRef = useRef<Child | null>(null);
  const queryClient = useQueryClient();
  const {
    mutate: pullImage,
    isPending: isPulling,
    reset,
  } = useMutation({
    mutationFn: async (reference: string) => {
      const command = createCommand('script', ['-q', '/dev/null', 'container', 'images', 'pull', reference]);
      command.stdout.on('data', (line) => updateLog(line, 'stdout'));
      command.stderr.on('data', (line) => updateLog(line, 'stderr'));
      processRef.current = await command.spawn();

      const result = await new Promise<TerminatedPayload>((resolve, reject) => {
        command.on('close', resolve);
        command.on('error', reject);
      });
      if (result.code !== 0) {
        throw new Error(`Failed to pull image: code ${result.code}`);
      }
    },
    onSettled: () => {
      setLog(null);
      setImage('');
      processRef.current = null;
    },
    onSuccess: () => {
      onClose();
      void queryClient.refetchQueries({ queryKey: ['images'] });
      void message(`${image} has been pulled successfully`, {
        title: 'Pull finished',
      });
    },
    onError: (error) => {
      void message(error.message ?? 'Failed to pull image', {
        title: 'Pull failed',
      });
    },
  });

  useEffect(() => {
    return () => {
      if (processRef.current) {
        void processRef.current.kill();
        processRef.current = null;
      }
    };
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      isDismissable={isPulling}
      isKeyboardDismissDisabled={isPulling}
      hideCloseButton={isPulling}
    >
      <ModalContent>
        {() => {
          return (
            <>
              <ModalHeader>{isPulling ? `Pulling ${image}` : 'Pull Image'}</ModalHeader>
              <ModalBody>
                {isPulling ? (
                  <div
                    className={cn(
                      'h-10 truncate rounded-xl bg-gray-950 p-3 text-xs',
                      log?.type === 'stderr' ? 'text-red-400' : 'text-[#0f0]',
                    )}
                  >
                    {log?.line || 'Pulling...'}
                  </div>
                ) : (
                  <Input
                    type="text"
                    placeholder="Image reference (e.g. postgres:latest)"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    disabled={isPulling}
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    autoSave="off"
                    autoFocus
                  />
                )}
              </ModalBody>
              <ModalFooter>
                {isPulling ? (
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={() => {
                      if (processRef.current) {
                        processRef.current.kill();
                        processRef.current = null;
                      }
                      reset();
                    }}
                  >
                    Stop
                  </Button>
                ) : null}
                <Button
                  color="primary"
                  startContent={isPulling ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                  isDisabled={isPulling || !image}
                  onPress={() => pullImage(image)}
                  className="ml-auto"
                >
                  Start Pull
                </Button>
              </ModalFooter>
            </>
          );
        }}
      </ModalContent>
    </Modal>
  );
}
