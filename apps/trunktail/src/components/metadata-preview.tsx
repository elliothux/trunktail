import { Button } from '@heroui/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/modal';
import { ScrollShadow } from '@heroui/scroll-shadow';
import type { UseDisclosureReturn } from '@heroui/use-disclosure';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { toast } from 'sonner';

interface Props {
  title: string;
  metadata: unknown;
  disclosure: UseDisclosureReturn;
}

export function MetadataPreview({ title, metadata: raw, disclosure: { isOpen, onOpen, onOpenChange } }: Props) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => {
          const metadata = JSON.stringify(raw, null, 2);
          return (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody className="p-0">
                <ScrollShadow className="max-h-[calc(90vh-72px-60px)] px-6 pb-8">
                  {metadata.split('\n').map((line, index) => (
                    <pre key={index} className="text-xs text-gray-600">
                      {line}
                    </pre>
                  ))}
                </ScrollShadow>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={async () => {
                    onClose();
                    await writeText(metadata);
                    toast.success('Copied to clipboard');
                  }}
                >
                  Copy
                </Button>
              </ModalFooter>
            </>
          );
        }}
      </ModalContent>
    </Modal>
  );
}
