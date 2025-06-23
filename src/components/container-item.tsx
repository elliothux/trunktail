import { OperationButton } from '@/components/ui/operation-button';
import { ContainerInfo, startContainer } from '@/lib/bridge/containers';
import { Button } from '@heroui/button';
import { Folder, Link, Play, Square, Trash2 } from 'lucide-react';

interface Props {
  container: ContainerInfo;
  active: boolean;
  onSelect: (image: ContainerInfo) => void;
}

export function ContainerItem({
  container: {
    status,
    configuration: {
      id,
      image: { reference },
    },
  },
  container,
  active,
  onSelect,
}: Props) {
  const [name, tag] = reference.split(':');

  return (
    <Button
      as="section"
      className="mb-1 flex w-full items-center justify-between px-4"
      variant={active ? 'solid' : 'light'}
      color={active ? 'primary' : 'default'}
      onPress={() => onSelect(container)}
      size="lg"
    >
      <div>
        <p className="text-sm">{id}</p>
        <p className="text-muted-foreground text-xs opacity-80">
          {name}:<span className="text-muted-foreground">{tag}</span>
        </p>
      </div>
      <div className="flex items-center space-x-1">
        <OperationButton title="Link" active={active} icon={Link} />
        <OperationButton title="Folder" active={active} icon={Folder} />
        <OperationButton
          title={status === 'running' ? 'Stop container' : 'Start container'}
          active={active}
          icon={status === 'running' ? Square : Play}
          onClick={() => {
            startContainer(id).then(console.log).catch(console.error);
          }}
        />
        <OperationButton title="Delete" active={active} icon={Trash2} />
      </div>
    </Button>
  );
}
