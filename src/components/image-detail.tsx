import { ImageDescriptor, ImageInfo, OCIImageHistory } from '@/lib/bridge/images';
import { Badge } from '@heroui/badge';
import { Snippet } from '@heroui/snippet';
import { filesize } from 'filesize';

interface Props {
  image: ImageInfo;
}

function DetailItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <div className="text-xs text-gray-400">{label}</div>
      <Snippet
        className="mb-4 max-w-full bg-transparent p-0 text-sm"
        classNames={{
          pre: 'overflow-scroll scrollbar-hide grow-0 shrink',
        }}
        symbol=""
      >
        {children}
      </Snippet>
    </>
  );
}

function HistoryItem({ item }: { item: OCIImageHistory }) {
  return (
    <div className="flex gap-4">
      <div className="font-mono text-xs text-gray-400">{new Date(item.created).toLocaleString()}</div>
      <div className="text-sm">{item.created_by}</div>
      {item.comment && <div className="text-sm text-gray-500">{item.comment}</div>}
    </div>
  );
}

function Descriptor({ item: { descriptor, config, manifest } }: { item: ImageDescriptor }) {
  return (
    <div className="mb-4 rounded-lg border border-gray-700 p-4">
      <h3 className="mb-2 text-base font-semibold">
        {descriptor.platform.os}/{descriptor.platform.architecture}{' '}
        {descriptor.platform.variant && `(${descriptor.platform.variant})`}
      </h3>
      <div className="grid grid-cols-2 gap-x-4">
        <DetailItem label="Digest">
          <span className="font-mono">{descriptor.digest}</span>
        </DetailItem>
        <DetailItem label="Size">{filesize(descriptor.size) as string}</DetailItem>
        <DetailItem label="Media Type">{descriptor.mediaType}</DetailItem>
        {config.created && <DetailItem label="Created">{new Date(config.created).toLocaleString()}</DetailItem>}
      </div>

      {config.config.Env && (
        <DetailItem label="Environment Variables">
          <div className="space-y-1 font-mono text-xs">
            {config.config.Env.map((env, i) => (
              <div key={i}>{env}</div>
            ))}
          </div>
        </DetailItem>
      )}

      <div className="grid grid-cols-2 gap-x-4">
        <DetailItem label="Entrypoint">
          <div className="font-mono text-xs">{config.config.Entrypoint?.join(' ') || 'not set'}</div>
        </DetailItem>
        <DetailItem label="Command">
          <div className="font-mono text-xs">{config.config.Cmd?.join(' ') || 'not set'}</div>
        </DetailItem>
        <DetailItem label="Working Directory">
          <div className="font-mono text-xs">{config.config.WorkingDir || 'not set'}</div>
        </DetailItem>
        <DetailItem label="Stop Signal">
          <div className="font-mono text-xs">{config.config.StopSignal || 'not set'}</div>
        </DetailItem>
      </div>

      {descriptor.annotations && (
        <>
          <h4 className="mt-3 mb-1 font-semibold">Annotations</h4>
          <div className="flex flex-wrap gap-1">
            {Object.entries(descriptor.annotations).map(([key, value]) => (
              <Badge key={key}>
                <span className="font-semibold">{key}:</span> {value}
              </Badge>
            ))}
          </div>
        </>
      )}

      {manifest.layers && (
        <>
          <h4 className="mt-3 mb-1 font-semibold">Layers ({manifest.layers.length})</h4>
          <div className="space-y-1">
            {manifest.layers.map((layer, i) => (
              <div key={i} className="flex items-center gap-2 font-mono text-xs">
                <span>{layer.digest}</span>
                <span className="text-gray-400">{filesize(layer.size) as string}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/*{config.history && (*/}
      {/*  <>*/}
      {/*    <h4 className="mt-3 mb-1 font-semibold">History</h4>*/}
      {/*    <div className="space-y-1">*/}
      {/*      {config.history*/}
      {/*        .slice()*/}
      {/*        .reverse()*/}
      {/*        .map((item, i) => (*/}
      {/*          <Fragment key={i}>*/}
      {/*            <HistoryItem item={item} />*/}
      {/*          </Fragment>*/}
      {/*        ))}*/}
      {/*    </div>*/}
      {/*  </>*/}
      {/*)}*/}

      {/*{config.config.Labels && (*/}
      {/*  <>*/}
      {/*    <h4 className="mt-3 mb-1 font-semibold">Labels</h4>*/}
      {/*    <div className="flex flex-wrap gap-1">*/}
      {/*      {Object.entries(config.config.Labels).map(([key, value]) => (*/}
      {/*        <Badge key={key}>*/}
      {/*          <span className="font-semibold">{key}:</span> {value}*/}
      {/*        </Badge>*/}
      {/*      ))}*/}
      {/*    </div>*/}
      {/*  </>*/}
      {/*)}*/}
    </div>
  );
}

export function ImageDetail({ image }: Props) {
  return (
    <>
      <DetailItem label="Reference">{image.reference}</DetailItem>
      <DetailItem label="Digest">
        <span className="font-mono">{image.digest}</span>
      </DetailItem>
      <DetailItem label="Schema Version">{image.schemaVersion}</DetailItem>
      <DetailItem label="Media Type">{image.mediaType}</DetailItem>

      {/*<div className="mt-6">*/}
      {/*  <h2 className="mb-2 text-lg font-semibold">Descriptors</h2>*/}
      {/*  {image.descriptors.map((item, i) => (*/}
      {/*    <Descriptor key={item.descriptor.digest} item={item} />*/}
      {/*  ))}*/}
      {/*</div>*/}
    </>
  );
}
