import { AccessType, type ExposedItemBase } from '$lib/types';

export const isWritable = (feature: ExposedItemBase): boolean => {
    return !feature.access || (feature.access & AccessType.ACCESS_WRITE) != 0
}
