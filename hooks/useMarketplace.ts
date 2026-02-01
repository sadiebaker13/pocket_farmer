import { useState, useMemo } from 'react';
import { DatabaseState } from '../types';
import { calculateDistance } from '../utils/calculations';

export const useMarketplace = (state: DatabaseState) => {
  const [filters, setFilters] = useState({
    type: 'All',
    season: 'All',
    radius: 50
  });
  // Mock customer location for demo purposes
  const customerLoc: [number, number] = [48.7787, -123.7079];

  const filteredListings = useMemo(() => {
    return state.listings.filter(item => {
      const farm = state.farms.find(f => f.id === item.farm_id);
      if (!farm) return false;
      
      const dist = calculateDistance(customerLoc[0], customerLoc[1], farm.location[0], farm.location[1]);
      
      const matchType = filters.type === 'All' || item.type === filters.type;
      const matchSeason = filters.season === 'All' || item.season === filters.season || item.season === 'Year-Round';
      const matchRadius = dist <= filters.radius;
      
      return matchType && matchSeason && matchRadius;
    });
  }, [state.listings, state.farms, filters, customerLoc]);

  return {
    filters,
    setFilters,
    filteredListings
  };
};