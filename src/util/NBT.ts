import { Buffer } from 'node:buffer';
import type * as prismarineNbt from 'prismarine-nbt';
import { type NBTInventoryItem } from '../helpers/TransformItemData.js';

let nbt: typeof prismarineNbt;

export async function parse(value: Buffer | number[] | string): Promise<NBTInventoryItem[]> {
	let buffer: Buffer;
	if (Buffer.isBuffer(value)) {
		buffer = value;
	} else {
		buffer = Array.isArray(value) ? Buffer.from(value) : Buffer.from(value, 'base64');
	}

	if (!nbt) {
		try {
			nbt = await import('prismarine-nbt');
		} catch {
			/* istanbul ignore next */
			throw new Error('prismarine-nbt must be installed to use this helper');
		}
	}

	return nbt.simplify((await nbt.parse(buffer)).parsed.value.i as never);
}
