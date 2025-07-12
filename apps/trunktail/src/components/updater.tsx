import { Button } from '@heroui/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal';
import { openUrl } from '@tauri-apps/plugin-opener';
import { compareVersions } from 'compare-versions';
import { useEffect, useMemo } from 'react';
import { useContainerSystem } from './system-context';

export function Updater() {
  const disclosure = useDisclosure();

  const { latestRelease, appInfo, version } = useContainerSystem();

  const latestAppVersion = latestRelease?.app.v;
  const currentAppVersion = appInfo?.appVersion;

  const latestCLIVersion = latestRelease?.cli.v;
  const currentCLIVersion = version?.split(' ')[0];

  const hasNewAppVersion = useMemo(() => {
    if (latestAppVersion == null || currentAppVersion == null) {
      return false;
    }
    return compareVersions(latestAppVersion, currentAppVersion) > 0;
  }, [latestAppVersion, currentAppVersion]);

  const hasNewCLIVersion = useMemo(() => {
    if (latestCLIVersion == null || currentCLIVersion == null) {
      return false;
    }
    return compareVersions(latestCLIVersion, currentCLIVersion) > 0;
  }, [latestCLIVersion, currentCLIVersion]);

  useEffect(() => {
    if (hasNewAppVersion || hasNewCLIVersion) {
      disclosure.onOpen();
    }
  }, [hasNewAppVersion, hasNewCLIVersion]);

  return (
    <Modal {...disclosure}>
      <ModalContent>
        {() => {
          if (hasNewAppVersion) {
            const app = latestRelease?.app;
            if (app == null) {
              setTimeout(disclosure.onClose, 0);
              return null;
            }

            return (
              <>
                <ModalHeader>
                  <h2 className="text-lg font-semibold text-white">App Update Available</h2>
                </ModalHeader>
                <ModalBody className="space-y-0.5 text-sm text-gray-300">
                  {app.d?.map((i, index) => <p key={index}>{i}</p>) ??
                    `A new version of Trunktail (${app.v}) is available.`}
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    onPress={() => {
                      void openUrl(app.u);
                    }}
                  >
                    Download Update
                  </Button>
                </ModalFooter>
              </>
            );
          }

          if (hasNewCLIVersion) {
            const cli = latestRelease?.cli;
            if (cli == null) {
              setTimeout(disclosure.onClose, 0);
              return null;
            }

            return (
              <>
                <ModalHeader>
                  <h2 className="text-lg font-semibold text-white">CLI Update Available</h2>
                </ModalHeader>
                <ModalBody className="space-y-0.5 text-sm text-gray-300">
                  {`A new version of Apple container CLI (${cli.v}) is available.`}
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    onPress={() => {
                      void openUrl(cli.u);
                    }}
                  >
                    Download Update
                  </Button>
                </ModalFooter>
              </>
            );
          }
        }}
      </ModalContent>
    </Modal>
  );
}
