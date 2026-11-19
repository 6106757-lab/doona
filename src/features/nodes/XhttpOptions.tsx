import {useT} from '../../i18n';
import {Disclosure, LabeledSelect, Switch, TextField, Toolbar} from '../../ui/ui';
import {xhttpModes, xPaddingMethods, xPaddingPlacements, type XhttpChange, type XhttpDownload, type XhttpFields} from '../../dae/xhttp';

// The controller owns the draft, its validation and the link these fields update.
export function XhttpOptions({
  fields,
  duplicates,
  onChange: set,
  isDisabled
}: {
  fields: XhttpFields;
  duplicates: ReadonlySet<number>;
  onChange: (change: XhttpChange) => void;
  isDisabled?: boolean;
}) {
  const t = useT();
  const setDownload = (download: Partial<XhttpDownload>) => set({download});
  const mode = fields.mode || 'auto';
  const setHeader = (index: number, name: string, value: string) => {
    const next = [...fields.headers];
    next[index] = [name, value];
    set({headers: next.filter(([rowName, rowValue]) => rowName || rowValue)});
  };
  return (
    <Disclosure title={t('nodes.xhttp.title')} flush compact>
      <span className="rp-label">{t('nodes.xhttp.help')}</span>
      <LabeledSelect
        label={t('nodes.xhttp.mode')}
        items={[...new Set([...xhttpModes, mode])].map(id => ({id, label: id}))}
        value={mode}
        isDisabled={isDisabled}
        onChange={next => next !== mode && set({mode: next})}
      />
      <Toolbar className="top">
        <TextField
          isDisabled={isDisabled}
          label={t('nodes.xhttp.path')}
          value={fields.path}
          placeholder="/"
          spellCheck={false}
          onChange={path => set({path})}
        />
        <TextField isDisabled={isDisabled} label={t('nodes.xhttp.host')} value={fields.host} spellCheck={false} onChange={host => set({host})} />
      </Toolbar>
      {[...fields.headers, ['', ''] as [string, string]].map(([name, value], index) => (
        <Toolbar className="top" key={index}>
          <TextField
            isDisabled={isDisabled}
            label={t('nodes.xhttp.headerName', {n: index + 1})}
            value={name}
            spellCheck={false}
            error={duplicates.has(index) ? t('nodes.xhttp.headerDuplicate') : undefined}
            onChange={next => setHeader(index, next, value)}
          />
          <TextField
            isDisabled={isDisabled}
            label={t('nodes.xhttp.headerValue', {n: index + 1})}
            value={value}
            spellCheck={false}
            onChange={next => setHeader(index, name, next)}
          />
        </Toolbar>
      ))}
      <TextField
        isDisabled={isDisabled}
        label={t('nodes.xhttp.padding')}
        value={fields.xPaddingBytes}
        placeholder="100-1000"
        onChange={xPaddingBytes => set({xPaddingBytes})}
      />
      <Switch
        isSelected={fields.xPaddingObfsMode}
        isDisabled={isDisabled}
        description={t('nodes.xhttp.paddingObfsHelp')}
        onChange={on =>
          set({
            xPaddingObfsMode: on,
            ...(on
              ? {xPaddingMethod: fields.xPaddingMethod || 'tokenish', xPaddingPlacement: fields.xPaddingPlacement || 'queryInHeader'}
              : {xPaddingMethod: '', xPaddingPlacement: '', xPaddingHeader: '', xPaddingKey: ''})
          })
        }
      >
        {t('nodes.xhttp.paddingObfs')}
      </Switch>
      {fields.xPaddingObfsMode && (
        <>
          <Toolbar className="top">
            <LabeledSelect
              label={t('nodes.xhttp.paddingMethod')}
              items={[...new Set([...xPaddingMethods, fields.xPaddingMethod])].filter(Boolean).map(id => ({id, label: id}))}
              value={fields.xPaddingMethod}
              isDisabled={isDisabled}
              onChange={next => next !== fields.xPaddingMethod && set({xPaddingMethod: next})}
            />
            <LabeledSelect
              label={t('nodes.xhttp.paddingPlacement')}
              items={[...new Set([...xPaddingPlacements, fields.xPaddingPlacement])].filter(Boolean).map(id => ({id, label: id}))}
              value={fields.xPaddingPlacement}
              isDisabled={isDisabled}
              onChange={next => next !== fields.xPaddingPlacement && set({xPaddingPlacement: next})}
            />
          </Toolbar>
          <Toolbar className="top">
            <TextField
              isDisabled={isDisabled}
              label={t('nodes.xhttp.paddingHeader')}
              value={fields.xPaddingHeader}
              spellCheck={false}
              onChange={xPaddingHeader => set({xPaddingHeader})}
            />
            <TextField
              isDisabled={isDisabled}
              label={t('nodes.xhttp.paddingKey')}
              value={fields.xPaddingKey}
              spellCheck={false}
              onChange={xPaddingKey => set({xPaddingKey})}
            />
          </Toolbar>
        </>
      )}
      <TextField
        isDisabled={isDisabled}
        label={t('nodes.xhttp.postBytes')}
        value={fields.scMaxEachPostBytes}
        placeholder="1000000"
        onChange={scMaxEachPostBytes => set({scMaxEachPostBytes})}
      />
      <TextField
        isDisabled={isDisabled}
        label={t('nodes.xhttp.postInterval')}
        value={fields.scMinPostsIntervalMs}
        placeholder="30"
        onChange={scMinPostsIntervalMs => set({scMinPostsIntervalMs})}
      />
      <Switch isSelected={fields.noGRPCHeader} isDisabled={isDisabled} onChange={noGRPCHeader => set({noGRPCHeader})}>
        {t('nodes.xhttp.noGrpcHeader')}
      </Switch>
      <Switch
        isSelected={!!fields.download}
        isDisabled={isDisabled}
        description={t('nodes.xhttp.downloadHelp')}
        onChange={on => set({download: on ? {address: '', port: '443', serverName: '', path: '', host: ''} : null})}
      >
        {t('nodes.xhttp.download')}
      </Switch>
      {fields.download && (
        <>
          <Toolbar className="top">
            <TextField
              isDisabled={isDisabled}
              label={t('nodes.xhttp.downloadAddress')}
              value={fields.download.address}
              spellCheck={false}
              onChange={address => setDownload({address})}
            />
            <TextField
              isDisabled={isDisabled}
              label={t('nodes.xhttp.downloadPort')}
              value={fields.download.port}
              width={96}
              onChange={port => setDownload({port})}
            />
          </Toolbar>
          <TextField
            isDisabled={isDisabled}
            label={t('nodes.xhttp.downloadServerName')}
            value={fields.download.serverName}
            spellCheck={false}
            onChange={serverName => setDownload({serverName})}
          />
          <Toolbar className="top">
            <TextField
              isDisabled={isDisabled}
              label={t('nodes.xhttp.downloadPath')}
              value={fields.download.path}
              placeholder="/"
              spellCheck={false}
              onChange={path => setDownload({path})}
            />
            <TextField
              isDisabled={isDisabled}
              label={t('nodes.xhttp.downloadHost')}
              value={fields.download.host}
              spellCheck={false}
              onChange={host => setDownload({host})}
            />
          </Toolbar>
        </>
      )}
    </Disclosure>
  );
}
