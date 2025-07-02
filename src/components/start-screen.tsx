import { Download, Loader, OctagonAlert, Play, TriangleAlert } from 'lucide-react';
import { useContainerSystem } from './system-context';
import { Button } from '@heroui/button';
import { useSystemOperations } from '@/hooks/use-system-operations';
import { openUrl } from '@tauri-apps/plugin-opener';

export function StartScreen() {
  const { command, supported } = useContainerSystem();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {supported ? command ? <NotRunning /> : <InstallAssistant /> : <Unsupport />}
    </div>
  );
}

function Unsupport() {
  return (
    <>
      <OctagonAlert size={32} className="text-red-500" />
      <p className="text-default-500 max-w-[400px] text-sm text-center mt-2">
        This app is not supported on your device because it relies on the library apple/containerization, which only
        supports Apple Silicon (M1/M2/M3 and later) chips.
      </p>
    </>
  );
}

function NotRunning() {
  const { start, isStarting } = useSystemOperations();

  return (
    <>
      <p className="text-default-500 max-w-[400px] text-center mt-2">Container server is not running</p>
      <Button
        color="primary"
        className="mt-2"
        startContent={isStarting ? <Loader className="animate-spin" size={16} /> : <Play size={16} />}
        onPress={() => start()}
        isDisabled={isStarting}
      >
        Start
      </Button>
    </>
  );
}

// TODO: Get latest version from server
const pkgLink = 'https://github.com/apple/container/releases/download/0.2.0/container-0.2.0-installer-signed.pkg';

function InstallAssistant() {
  return (
    <>
      <p className="text-default-500 max-w-[400px] text-center mt-2">Container server is not installed.</p>
      <Button
        color="primary"
        className="mt-2"
        startContent={<Download size={16} />}
        onPress={() => {
          void openUrl(pkgLink);
        }}
      >
        Download Installer
      </Button>
    </>
  );
}
