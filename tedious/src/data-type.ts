import Null from './data-types/null.ts';
import TinyInt from './data-types/tinyint.ts';
import Bit from './data-types/bit.ts';
import SmallInt from './data-types/smallint.ts';
import Int from './data-types/int.ts';
import SmallDateTime from './data-types/smalldatetime.ts';
import Real from './data-types/real.ts';
import Money from './data-types/money.ts';
import DateTime from './data-types/datetime.ts';
import Float from './data-types/float.ts';
import Decimal from './data-types/decimal.ts';
import Numeric from './data-types/numeric.ts';
import SmallMoney from './data-types/smallmoney.ts';
import BigInt from './data-types/bigint.ts';
import Image from './data-types/image.ts';
import Text from './data-types/text.ts';
import UniqueIdentifier from './data-types/uniqueidentifier.ts';
import IntN from './data-types/intn.ts';
import NText from './data-types/ntext.ts';
import BitN from './data-types/bitn.ts';
import DecimalN from './data-types/decimaln.ts';
import NumericN from './data-types/numericn.ts';
import FloatN from './data-types/floatn.ts';
import MoneyN from './data-types/moneyn.ts';
import DateTimeN from './data-types/datetimen.ts';
import VarBinary from './data-types/varbinary.ts';
import VarChar from './data-types/varchar.ts';
import Binary from './data-types/binary.ts';
import Char from './data-types/char.ts';
import NVarChar from './data-types/nvarchar.ts';
import NChar from './data-types/nchar.ts';
import Xml from './data-types/xml.ts';
import Time from './data-types/time.ts';
import Date from './data-types/date.ts';
import DateTime2 from './data-types/datetime2.ts';
import DateTimeOffset from './data-types/datetimeoffset.ts';
import UDT from './data-types/udt.ts';
import TVP from './data-types/tvp.ts';
import Variant from './data-types/sql-variant.ts';
import { CryptoMetadata } from './always-encrypted/types.ts';

import { InternalConnectionOptions } from './connection.ts';
import { Collation } from './collation.ts';

export interface Parameter {
  type: DataType;
  name: string;

  value: unknown;

  output: boolean;
  length?: number | undefined;
  precision?: number | undefined;
  scale?: number | undefined;

  nullable?: boolean | undefined;

  forceEncrypt?: boolean | undefined;
  cryptoMetadata?: CryptoMetadata | undefined;
  encryptedVal?: Buffer | undefined;
}


export interface ParameterData<T = any> {
  length?: number | undefined;
  scale?: number | undefined;
  precision?: number | undefined;

  collation?: Collation | undefined;

  value: T;
}

export interface DataType {
  id: number;
  type: string;
  name: string;

  declaration(parameter: Parameter): string;
  generateTypeInfo(parameter: ParameterData, options: InternalConnectionOptions): Buffer;
  generateParameterLength(parameter: ParameterData, options: InternalConnectionOptions): Buffer;
  generateParameterData(parameter: ParameterData, options: InternalConnectionOptions): Generator<Buffer, void>;
  validate(value: any, collation: Collation | undefined): any; // TODO: Refactor 'any' and replace with more specific type.

  hasTableName?: boolean;

  resolveLength?: (parameter: Parameter) => number;
  resolvePrecision?: (parameter: Parameter) => number;
  resolveScale?: (parameter: Parameter) => number;
}

export const TYPE = {
  [Null.id]: Null,
  [TinyInt.id]: TinyInt,
  [Bit.id]: Bit,
  [SmallInt.id]: SmallInt,
  [Int.id]: Int,
  [SmallDateTime.id]: SmallDateTime,
  [Real.id]: Real,
  [Money.id]: Money,
  [DateTime.id]: DateTime,
  [Float.id]: Float,
  [Decimal.id]: Decimal,
  [Numeric.id]: Numeric,
  [SmallMoney.id]: SmallMoney,
  [BigInt.id]: BigInt,
  [Image.id]: Image,
  [Text.id]: Text,
  [UniqueIdentifier.id]: UniqueIdentifier,
  [IntN.id]: IntN,
  [NText.id]: NText,
  [BitN.id]: BitN,
  [DecimalN.id]: DecimalN,
  [NumericN.id]: NumericN,
  [FloatN.id]: FloatN,
  [MoneyN.id]: MoneyN,
  [DateTimeN.id]: DateTimeN,
  [VarBinary.id]: VarBinary,
  [VarChar.id]: VarChar,
  [Binary.id]: Binary,
  [Char.id]: Char,
  [NVarChar.id]: NVarChar,
  [NChar.id]: NChar,
  [Xml.id]: Xml,
  [Time.id]: Time,
  [Date.id]: Date,
  [DateTime2.id]: DateTime2,
  [DateTimeOffset.id]: DateTimeOffset,
  [UDT.id]: UDT,
  [TVP.id]: TVP,
  [Variant.id]: Variant,
};

/**
 * <table>
 * <thead>
 *   <tr>
 *     <th>Type</th>
 *     <th>Constant</th>
 *     <th>JavaScript</th>
 *     <th>Result set</th>
 *     <th>Parameter</th>
 *   </tr>
 * </thead>
 *
 * <tbody>
 *   <tr class="group-heading">
 *     <th colspan="5">Exact numerics</th>
 *   </tr>
 *   <tr>
 *     <td><code>bit</code></td>
 *     <td><code>[[TYPES.Bit]]</code></td>
 *     <td><code>boolean</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>tinyint</code></td>
 *     <td><code>[[TYPES.TinyInt]]</code></td>
 *     <td><code>number</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>smallint</code></td>
 *     <td><code>[[TYPES.SmallInt]]</code></td>
 *     <td><code>number</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>int</code></td>
 *     <td><code>[[TYPES.Int]]</code></td>
 *     <td><code>number</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>bigint</code><sup>1</sup></td>
 *     <td><code>[[TYPES.BigInt]]</code></td>
 *     <td><code>string</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>numeric</code><sup>2</sup></td>
 *     <td><code>[[TYPES.Numeric]]</code></td>
 *     <td><code>number</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>decimal</code><sup>2</sup></td>
 *     <td><code>[[TYPES.Decimal]]</code></td>
 *     <td><code>number</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>smallmoney</code></td>
 *     <td><code>[[TYPES.SmallMoney]]</code></td>
 *     <td><code>number</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>money</code></td>
 *     <td><code>[[TYPES.Money]]</code></td>
 *     <td><code>number</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 * </tbody>
 *
 * <tbody>
 *   <tr class="group-heading">
 *     <th colspan="5">Approximate numerics</th>
 *   </tr>
 *   <tr>
 *     <td><code>float</code></td>
 *     <td><code>[[TYPES.Float]]</code></td>
 *     <td><code>number</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>real</code></td>
 *     <td><code>[[TYPES.Real]]</code></td>
 *     <td><code>number</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 * </tbody>
 *
 * <tbody>
 *   <tr class="group-heading">
 *     <th colspan="4">Date and Time</th>
 *   </tr>
 *   <tr>
 *     <td><code>smalldatetime</code></td>
 *     <td><code>[[TYPES.SmallDateTime]]</code></td>
 *     <td><code>Date</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>datetime</code></td>
 *     <td><code>[[TYPES.DateTime]]</code></td>
 *     <td><code>Date</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>datetime2</code></td>
 *     <td><code>[[TYPES.DateTime2]]</code></td>
 *     <td><code>Date</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>datetimeoffset</code></td>
 *     <td><code>[[TYPES.DateTimeOffset]]</code></td>
 *     <td><code>Date</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>time</code></td>
 *     <td><code>[[TYPES.Time]]</code></td>
 *     <td><code>Date</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>date</code></td>
 *     <td><code>[[TYPES.Date]]</code></td>
 *     <td><code>Date</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 * </tbody>
 *
 * <tbody>
 *   <tr class="group-heading">
 *     <th colspan="4">Character Strings</th>
 *   </tr>
 *   <tr>
 *     <td><code>char</code></td>
 *     <td><code>[[TYPES.Char]]</code></td>
 *     <td><code>string</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>varchar</code><sup>3</sup></td>
 *     <td><code>[[TYPES.VarChar]]</code></td>
 *     <td><code>string</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>text</code></td>
 *     <td><code>[[TYPES.Text]]</code></td>
 *     <td><code>string</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 * </tbody>
 *
 * <tbody>
 *   <tr class="group-heading">
 *     <th colspan="4">Unicode Strings</th>
 *   </tr>
 *   <tr>
 *     <td><code>nchar</code></td>
 *     <td><code>[[TYPES.NChar]]</code></td>
 *     <td><code>string</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>nvarchar</code><sup>3</sup></td>
 *     <td><code>[[TYPES.NVarChar]]</code></td>
 *     <td><code>string</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>ntext</code></td>
 *     <td><code>[[TYPES.NText]]</code></td>
 *     <td><code>string</code></td>
 *     <td>✓</td>
 *     <td>-</td>
 *   </tr>
 * </tbody>
 *
 * <tbody>
 *   <tr class="group-heading">
 *     <th colspan="5">Binary Strings<sup>4</sup></th>
 *   </tr>
 *   <tr>
 *     <td><code>binary</code></td>
 *     <td><code>[[TYPES.Binary]]</code></td>
 *     <td><code>Buffer</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>varbinary</code></td>
 *     <td><code>[[TYPES.VarBinary]]</code></td>
 *     <td><code>Buffer</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>image</code></td>
 *     <td><code>[[TYPES.Image]]</code></td>
 *     <td><code>Buffer</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 * </tbody>
 *
 * <tbody>
 *   <tr class="group-heading">
 *     <th colspan="5">Other Data Types</th>
 *   </tr>
 *   <tr>
 *     <td><code>TVP</code></td>
 *     <td><code>[[TYPES.TVP]]</code></td>
 *     <td><code>Object</code></td>
 *     <td>-</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>UDT</code></td>
 *     <td><code>[[TYPES.UDT]]</code></td>
 *     <td><code>Buffer</code></td>
 *     <td>✓</td>
 *     <td>-</td>
 *   </tr>
 *   <tr>
 *     <td><code>uniqueidentifier</code><sup>4</sup></td>
 *     <td><code>[[TYPES.UniqueIdentifier]]</code></td>
 *     <td><code>string</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>variant</code></td>
 *     <td><code>[[TYPES.Variant]]</code></td>
 *     <td><code>any</code></td>
 *     <td>✓</td>
 *     <td>-</td>
 *   </tr>
 *   <tr>
 *     <td><code>xml</code></td>
 *     <td><code>[[TYPES.Xml]]</code></td>
 *     <td><code>string</code></td>
 *     <td>✓</td>
 *     <td>-</td>
 *   </tr>
 * </tbody>
 * </table>
 *
 * <ol>
 *   <li>
 *     <h4>BigInt</h4>
 *     <p>
 *       Values are returned as a string. This is because values can exceed 53 bits of significant data, which is greater than a
 *       Javascript <code>number</code> type can represent as an integer.
 *     </p>
 *   </li>
 *   <li>
 *     <h4>Numerical, Decimal</h4>
 *     <p>
 *       For input parameters, default precision is 18 and default scale is 0. Maximum supported precision is 19.
 *     </p>
 *   </li>
 *   <li>
 *     <h4>VarChar, NVarChar</h4>
 *     <p>
 *       <code>varchar(max)</code> and <code>nvarchar(max)</code> are also supported.
 *     </p>
 *   </li>
 *   <li>
 *     <h4>UniqueIdentifier</h4>
 *     <p>
 *       Values are returned as a 16 byte hexadecimal string.
 *     </p>
 *     <p>
 *       Note that the order of bytes is not the same as the character representation. See
 *       <a href="http://msdn.microsoft.com/en-us/library/ms190215.aspx">Using uniqueidentifier Data</a>
 *       for an example of the different ordering of bytes.
 *     </p>
 *   </li>
 * </ol>
 */
export const TYPES = {
  TinyInt,
  Bit,
  SmallInt,
  Int,
  SmallDateTime,
  Real,
  Money,
  DateTime,
  Float,
  Decimal,
  Numeric,
  SmallMoney,
  BigInt,
  Image,
  Text,
  UniqueIdentifier,
  NText,
  VarBinary,
  VarChar,
  Binary,
  Char,
  NVarChar,
  NChar,
  Xml,
  Time,
  Date,
  DateTime2,
  DateTimeOffset,
  UDT,
  TVP,
  Variant
};

export const typeByName = TYPES;
