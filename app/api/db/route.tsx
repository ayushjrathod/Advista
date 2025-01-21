import { DataAPIClient } from '@datastax/astra-db-ts';
import { NextResponse } from 'next/server';



export async function POST(request: Request) {
    const client = new DataAPIClient('AstraCS:eeerxuCwdOYnyQLWzLKheuRU:fae990643a325349a352c0637b416e64a525bafb040eaa09694568b645528f5f');
    const db = client.db('https://f1709d77-1fe2-47f5-b976-1261a15c3375-us-east1.apps.astra.datastax.com',{keyspace: 'default_keyspace'});
    try {
    const body = await request.json();
    const session_id = body.session_id || '20250119_041143'; // Add default fallback
    console.log('Received request for session:', session_id);

    if (!session_id) {
      console.error('Missing session_id in request');
      return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
    }

    const collection = await db.collection('searches');4
   const  results = await collection.find({session_id: session_id});
    console.log('Querying collection for session:', results);
    
    const result = await collection.findOne(
      { _id: session_id }
    );

    if (!result) {
      console.error('No document found for session:', session_id);
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    console.log('Found document for session:', session_id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
