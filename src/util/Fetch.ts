import { type Response } from 'undici';

export async function consumeBody(res: Response) {
	if (!res.body || res.bodyUsed) return;

	for await (const _ of res.body) {
		// force consumption of body
	}
}
