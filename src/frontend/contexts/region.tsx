'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { HttpTypes } from '@medusajs/types';
import { medusa } from '@/lib/medusa/sdk';

type RegionContextType = {
    region?: HttpTypes.StoreRegion;
    setRegion: (value: HttpTypes.StoreRegion) => void;
};

const RegionContext = createContext<RegionContextType | null>(null);

type RegionProviderProps = {
    children: ReactNode;
};

export const RegionProvider = ({ children }: RegionProviderProps) => {
    const [region, setRegion] = useState<HttpTypes.StoreRegion>();

    useEffect(() => {
        if (region) {
            // set its ID in the local storage in
            // case it changed
            localStorage.setItem('region_id', region.id);
            return;
        }

        const regionId = localStorage.getItem('region_id');
        if (!regionId) {
            // retrieve regions and select the first one
            medusa.store.region.list().then(({ regions }) => {
                setRegion(regions[0]);
            });
        } else {
            // retrieve selected region
            medusa.store.region.retrieve(regionId).then(({ region: dataRegion }) => {
                setRegion(dataRegion);
            });
        }
    }, [region]);

    return (
        <RegionContext.Provider
            value={{
                region,
                setRegion,
            }}
        >
            {children}
        </RegionContext.Provider>
    );
};

export function useRegion() {
    const context = useContext(RegionContext);

    if (!context) {
        throw new Error('useRegion must be used within a RegionProvider');
    }

    return context;
}
