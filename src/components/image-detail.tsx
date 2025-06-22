import { ImageDescriptor, ImageInfo, OCIImageHistory } from '@/lib/bridge/images';
import { Badge } from '@heroui/badge';
import { filesize } from 'filesize';
import { DetailRow } from './ui/detail-row';

interface Props {
  image: ImageInfo;
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
        <DetailRow label="Digest">{descriptor.digest}</DetailRow>

        <DetailRow label="Size">{filesize(descriptor.size) as string}</DetailRow>
        <DetailRow label="Media Type">{descriptor.mediaType}</DetailRow>
        {config.created && <DetailRow label="Created">{new Date(config.created).toLocaleString()}</DetailRow>}
      </div>

      {config.config.Env && (
        <DetailRow label="Environment Variables">
          {config.config.Env.map((env, i) => (
            <div key={i}>{env}</div>
          ))}
        </DetailRow>
      )}

      <div className="grid grid-cols-2 gap-x-4">
        <DetailRow label="Entrypoint">{config.config.Entrypoint?.join(' ') || 'not set'}</DetailRow>
        <DetailRow label="Command">{config.config.Cmd?.join(' ') || 'not set'}</DetailRow>
        <DetailRow label="Working Directory">{config.config.WorkingDir || 'not set'}</DetailRow>
        <DetailRow label="Stop Signal">{config.config.StopSignal || 'not set'}</DetailRow>
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
      <DetailRow label="Reference">{image.reference}</DetailRow>
      <DetailRow label="Digest">{image.digest}</DetailRow>
      <DetailRow label="Schema Version">{image.schemaVersion}</DetailRow>
      <DetailRow label="Media Type">{image.mediaType}</DetailRow>

      {/*<div className="mt-6">*/}
      {/*  <h2 className="mb-2 text-lg font-semibold">Descriptors</h2>*/}
      {/*  {image.descriptors.map((item, i) => (*/}
      {/*    <Descriptor key={item.descriptor.digest} item={item} />*/}
      {/*  ))}*/}
      {/*</div>*/}
    </>
  );
}
