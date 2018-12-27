import { numberToBinaryStringWithPadding } from './utils';

/*
 * STUN Message Header
 *
 *  0                   1                   2                   3
 *  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
 * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 * |0 0|     STUN Message Type     |         Message Length        |
 * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 * |                         Magic Cookie                          |
 * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 * |                                                               |
 * |                     Transaction ID (96 bits)                  |
 * |                                                               |
 * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 *
 */
export class Header {
  private _type: number;
  private _length: number;
  private _magicCookie: number;
  private _transactionId: string;
  constructor(type: number, transactionId: string) {
    this._type = type;
    this._length = 0;
    this._magicCookie = 0x2112a442;
    this._transactionId = transactionId;
  }

  get type(): number {
    return this._type;
  }

  get length(): number {
    return this._length;
  }

  get transactionId(): string {
    return this._transactionId;
  }

  getMagicCookieAsBuffer(): Buffer {
    const $magicCookie = Buffer.alloc(4);
    $magicCookie.writeInt32BE(this._magicCookie, 0);

    return $magicCookie;
  }

  getTransactionIdAsBuffer(): Buffer {
    const $transactionId = Buffer.alloc(12);
    $transactionId.write(this._transactionId, 0, 12, 'hex');

    return $transactionId;
  }

  toBuffer(bodyLen: number = this._length): Buffer {
    const $type = Buffer.alloc(2);
    $type.writeUInt16BE(this._type, 0);

    const $length = Buffer.alloc(2);
    $length.writeUInt16BE(bodyLen, 0);

    return Buffer.concat([
      $type,
      $length,
      this.getMagicCookieAsBuffer(),
      this.getTransactionIdAsBuffer(),
    ]);
  }

  loadBuffer($header: Buffer): boolean {
    this._type = $header.readUInt16BE(0);
    this._length = $header.readUInt16BE(2);
    this._magicCookie = $header.readUInt32BE(4);
    this._transactionId = $header.slice(8, 20).toString('hex');

    // TODO: check type(cls, mtd)
    console.log(numberToBinaryStringWithPadding(this._type, 16));

    if (this._magicCookie !== 0x2112a442) {
      return false;
    }

    return true;
  }
}
