import { Card, CardBody } from '@heroui/card';
import { Link } from '@heroui/link';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/modal';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { UseDisclosureReturn } from '@heroui/use-disclosure';
import { Logo } from './logo';
import { useContainerSystem } from './system-context';

interface Props {
  disclosure: UseDisclosureReturn;
}

export function About({ disclosure: { isOpen, onOpenChange } }: Props) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent className="w-[40vw] max-w-[520px] min-w-[360px]">{() => <AboutDetail />}</ModalContent>
    </Modal>
  );
}

function AboutDetail() {
  const { version, command, appInfo } = useContainerSystem();

  const openSourceLibraries = [
    { name: 'TypeScript', description: 'Type-safe JavaScript', url: 'https://www.typescriptlang.org' },
    { name: 'Rust', description: 'System Backend', url: 'https://www.rust-lang.org' },
    { name: 'Swift', description: 'Native Bridge', url: 'https://swift.org' },
    { name: 'Tauri', description: 'Desktop App Framework', url: 'https://tauri.app' },
    { name: 'React', description: 'UI Library', url: 'https://reactjs.org' },
    { name: 'Vite', description: 'Build Tool', url: 'https://vitejs.dev' },
    { name: 'TanStack', description: 'Query, Router, etc.', url: 'https://tanstack.com' },
    { name: 'HeroUI', description: 'Component Library', url: 'https://www.heroui.com' },
  ];

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">
        <div className="pt-2">
          <Logo className="w-32" tailColor="#000" />
          <p className="text-default-500 mt-2 text-sm">Container Management Tool</p>
        </div>
      </ModalHeader>

      <ModalBody className="p-0">
        <ScrollShadow className="max-h-[calc(90vh-130px)] px-6 pt-4 pb-8">
          <div className="space-y-6">
            {/* Version Information */}
            <Card>
              <CardBody>
                <h3 className="mb-3 text-lg font-semibold">Version Information</h3>
                <div className="flex flex-col gap-4 text-sm">
                  <div>
                    <span className="text-default-500">App Version:</span>
                    <p className="font-mono">{appInfo?.appVersion || 'unknown'}</p>
                  </div>
                  <div>
                    <span className="text-default-500">Server Version:</span>
                    <p className="font-mono">{version}</p>
                  </div>
                  <div>
                    <span className="text-default-500">CLI Path:</span>
                    <p className="font-mono">{command}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-default-500">Tauri Version:</span>
                    <p className="font-mono">{appInfo?.tauriVersion || 'unknown'}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Developer Information */}
            <Card>
              <CardBody>
                <h3 className="mb-3 text-lg font-semibold">Developer</h3>
                <div className="grid grid-cols-2 space-x-2">
                  <div className="flex items-center gap-2">
                    <span className="text-default-500">GitHub:</span>
                    <Link
                      href="https://github.com/elliothux"
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                      size="sm"
                    >
                      @elliothux
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-default-500">X:</span>
                    <Link
                      href="https://x.com/elliothux"
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                      size="sm"
                    >
                      @elliothux
                    </Link>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Open Source Libraries */}
            <Card>
              <CardBody>
                <h3 className="mb-3 text-lg font-semibold">Built with Open Source</h3>
                <div className="grid gap-2 md:grid-cols-2">
                  {openSourceLibraries.map((lib) => (
                    <div
                      key={lib.name}
                      className="hover:bg-default-100 flex items-center justify-between rounded-lg p-2 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <Link
                          href={lib.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          color="foreground"
                          size="sm"
                          className="font-medium"
                        >
                          {lib.name}
                        </Link>
                        <p className="text-default-500 truncate text-xs">{lib.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Footer */}
            <div className="text-default-400 text-center text-xs">
              <p>Made with ❤️ for the open source community</p>
            </div>
          </div>
        </ScrollShadow>
      </ModalBody>
    </>
  );
}
