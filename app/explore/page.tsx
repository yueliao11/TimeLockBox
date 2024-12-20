'use client';

import { useCurrentAccount } from '@mysten/dapp-kit';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimeCapsule } from '@/lib/types';
import { useState, useEffect } from 'react';
import { CapsuleCard } from '../capsules/my/components/CapsuleCard';
import { Loader2Icon } from 'lucide-react';

export default function Explore() {
  const account = useCurrentAccount();
  const [loading, setLoading] = useState(true);
  const [capsules, setCapsules] = useState<TimeCapsule[]>([]);
  const [filters, setFilters] = useState({
    category: 'all',
    sort: 'popular',
    search: ''
  });
  
  if (!account) {
    redirect('/');
  }

  useEffect(() => {
    loadCapsules();
  }, [filters]);

  async function loadCapsules() {
    try {
      setLoading(true);
      // TODO: Implement explore API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCapsules: TimeCapsule[] = Array(9).fill(null).map((_, i) => ({
        id: `explore-${i}`,
        creatorId: `user-${i}`,
        title: `Public Capsule ${i + 1}`,
        description: 'This is a public time capsule',
        type: Math.random() > 0.5 ? 'one-time' : 'recurring',
        status: 'pending',
        unlockTimes: [{
          date: new Date(Date.now() + 86400000 * (i + 1)),
          type: 'fixed',
          notified: false
        }],
        recipients: [],
        contents: [],
        encryptionKey: '',
        createdAt: new Date(Date.now() - 86400000 * i),
        updatedAt: new Date(Date.now() - 86400000 * i)
      }));
      
      setCapsules(mockCapsules);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Explore</h1>
        
        <Card className="p-4">
          <div className="flex gap-4">
            <Input
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search public capsules..."
              className="flex-1"
            />
            
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="historical">Historical</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.sort}
              onValueChange={(value) => setFilters(prev => ({ ...prev, sort: value }))}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2Icon className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capsules.map(capsule => (
              <CapsuleCard key={capsule.id} capsule={capsule} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}