'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function CapsuleFilters({ filters, setFilters }) {
  return (
    <div className="flex gap-4">
      <Input
        placeholder="Search capsules..."
        value={filters.search}
        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
        className="w-[200px]"
      />
      
      <Select
        value={filters.status}
        onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="unlocked">Unlocked</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
      
      <Select
        value={filters.type}
        onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="one-time">One-time</SelectItem>
          <SelectItem value="recurring">Recurring</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}