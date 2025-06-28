import { ContainerDetail } from '@/components/container-detail';
import { ContainerItem } from '@/components/container-item';
import { Portal } from '@/components/portal';
import { ContainerInfo, listContainers } from '@/lib/bridge/containers';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
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

  const [container, setContainer] = useState<ContainerInfo | null>(null);

  const running = containers?.filter((i) => i.status === 'running')?.length;

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
            active={item === container}
            onSelect={() => {
              setContainer(item);
            }}
          />
        ))}
      </>

      <Portal name="right-panel-title">Info</Portal>
      <Portal name="right-panel">
        {container ? <ContainerDetail container={container} /> : <div>No Selected</div>}
      </Portal>
    </>
  );
}
