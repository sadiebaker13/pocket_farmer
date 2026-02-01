import { useMemo } from 'react';
import { DatabaseState } from '../types';
import { calculateDistance } from '../utils/calculations';
import { MATCH_RADIUS_KM } from '../utils/constants';

export const useFarmData = (state: DatabaseState, activeUserId: string) => {
  return useMemo(() => {
    const user = state.users.find(u => u.id === activeUserId);
    const workRel = state.worksAt.find(rel => rel.in === activeUserId);
    const farm = workRel ? state.farms.find(f => f.id === workRel.out) : null;
    
    // Logic: "One Farm : Many Employees"
    const teamMembers = farm 
      ? state.worksAt.filter(rel => rel.out === farm.id && rel.in !== activeUserId) 
      : [];
    
    const isOwner = workRel?.role === 'Owner';
    const isEmployee = workRel?.role === 'Employee';
    
    const farmListings = farm 
      ? state.listings.filter(l => l.farm_id === farm.id) 
      : [];

    const matchingIsos = farm ? state.isoRequests.filter(iso => {
        const isCategoryMatch = farm.specialties.some(s => 
          s.toLowerCase().includes(iso.category.toLowerCase()) || 
          iso.category.toLowerCase().includes(s.toLowerCase()) ||
          (s === "Vegetables" && iso.category === "Veggie")
        );
        const dist = calculateDistance(farm.location[0], farm.location[1], iso.location[0], iso.location[1]);
        return isCategoryMatch && dist < MATCH_RADIUS_KM; 
      }) : [];

    return {
      user,
      farm,
      workRel,
      teamMembers,
      isOwner,
      isEmployee,
      farmListings,
      matchingIsos
    };
  }, [state.users, state.worksAt, state.farms, state.listings, state.isoRequests, activeUserId]);
};