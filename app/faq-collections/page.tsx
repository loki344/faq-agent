import { createClient } from '@/utils/supabase/server';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { CreateFaqCollection } from './create-collection';

export default async function FaqCollectionsPage() {
  
  const response = await fetch('http://localhost:3000/api/faq_collections', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const collections = await response.json();

  return (
    <main className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">FAQ Collections</h1>
        <CreateFaqCollection />
      </div>

      {collections?.length === 0 ? (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">No FAQ Collections yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first FAQ collection to get started
          </p>
          <CreateFaqCollection />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections?.map((collection) => (
            <Link key={collection.id} href={`/faq-collections/${collection.id}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold mb-2">{collection.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(collection.created_at).toLocaleDateString()}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
