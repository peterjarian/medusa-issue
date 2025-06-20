'use client';

import { useRegion } from '@/frontend/contexts';

export default function Page() {
    const { region } = useRegion();

    console.log(region);

    return <p>{region?.name}</p>;
}
