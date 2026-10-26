import { createServerFn } from '@tanstack/react-start';

import { getPhotos } from '@/lib/photos';

export const loadPhotos = createServerFn({ method: 'GET' }).handler(async () => getPhotos());
