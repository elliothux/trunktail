import { ContainerDetail } from '@/components/container-detail';
import { ContainerItem } from '@/components/container-item';
import { MetadataPreview } from '@/components/metadata-preview';
import { Portal } from '@/components/portal';
import { listContainers } from '@/lib/bridge/containers';
import { Button } from '@heroui/button';
import { useDisclosure } from '@heroui/modal';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Info } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/_app/containers')({
  component: ContainersPage,
});

function ContainersPage() {
  const { data: containers } = useQuery({
    queryKey: ['containers'],
    queryFn: listContainers,
    refetchOnMount: 'always',
  });

  const [current, setCurrent] = useState<string | null>(null);

  const running = containers?.filter((i) => i.status === 'running')?.length;

  const disclosure = useDisclosure();

  const container = containers?.find((i) => i.configuration.id === current) ?? null;

  return (
    <>
      <Portal name="title">
        <p>Containers</p>
        <p className="text-xs font-normal text-gray-400">
          {running ? `${running} running` : `${containers?.length} containers`}
        </p>
      </Portal>

      <>
        {containers?.map((item) => (
          <ContainerItem
            key={item.configuration.id}
            container={item}
            active={item.configuration.id === current}
            onSelect={setCurrent}
          />
        ))}
      </>

      <Portal name="right-panel-title">
        <p>Details</p>
        {container ? (
          <Button size="sm" className="ml-auto" variant="light" onPress={disclosure.onOpen} isIconOnly>
            <Info size={18} />
          </Button>
        ) : null}
      </Portal>
      <Portal name="right-panel">
        {container ? <ContainerDetail container={container} /> : <div>No Selected</div>}
      </Portal>

      <MetadataPreview title="Container Metadata" metadata={container} disclosure={disclosure} />
    </>
  );
}
