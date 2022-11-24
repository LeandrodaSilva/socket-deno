import BulkLoad from './bulk-load.ts';
import Connection, { ConnectionConfiguration } from './connection.ts';
import Request from './request.ts';
import { name } from './library.ts';

import { ConnectionError, RequestError } from './errors.ts';

import { TYPES } from './data-type.ts';
import { ISOLATION_LEVEL } from './transaction.ts';
import { versions as TDS_VERSION } from './tds-versions.ts';

const library = { name: name };

export function connect(config: ConnectionConfiguration, connectListener?: (err?: Error) => void) {
  const connection = new Connection(config);
  connection.connect(connectListener);
  return connection;
}

export {
  BulkLoad,
  Connection,
  Request,
  library,
  ConnectionError,
  RequestError,
  TYPES,
  ISOLATION_LEVEL,
  TDS_VERSION
};
