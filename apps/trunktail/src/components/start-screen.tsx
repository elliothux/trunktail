import { useSystemOperations } from '@/hooks/use-system-operations';
import { Button } from '@heroui/button';
import { openUrl } from '@tauri-apps/plugin-opener';
import { Download, Loader2, OctagonAlert, Play } from 'lucide-react';
import { useContainerSystem } from './system-context';

export function StartScreen() {
  const { command, supported } = useContainerSystem();

  return (
    <div className="flex h-full flex-col items-center justify-center">
      {supported ? command ? <NotRunning /> : <InstallAssistant /> : <Unsupported />}
    </div>
  );
}

function Unsupported() {
  return (
    <>
      <OctagonAlert size={32} className="text-red-500" />
      <p className="mt-2 max-w-[400px] text-center text-sm text-gray-300">
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
      <p className="mt-2 max-w-[400px] text-center text-gray-300">Container server is not running</p>
      <Button
        color="primary"
        className="mt-2"
        startContent={isStarting ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
        onPress={() => start()}
        isDisabled={isStarting}
      >
        Start
      </Button>
    </>
  );
}

function InstallAssistant() {
  const { latestRelease } = useContainerSystem();

  const url = latestRelease?.cli.u;
  return (
    <>
      <p className="mt-2 max-w-[400px] text-center text-gray-300">Container server is not installed.</p>
      <Button
        color="primary"
        className="mt-2"
        startContent={<Download size={16} />}
        onPress={() => {
          if (url) {
            void openUrl(url);
          }
        }}
        disabled={url == null}
      >
        Download Installer
      </Button>
    </>
  );
}
