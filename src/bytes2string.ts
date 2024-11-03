import * as os from 'os';
import * as iconv from 'iconv-lite';

export function bytes2string(bytes: Uint8Array): string {
    const charset = os.platform() === 'win32' ? 'gbk' : 'utf8';
    return iconv.decode(Buffer.from(bytes), charset);  // 将 Uint8Array 转换为 Buffer
}
