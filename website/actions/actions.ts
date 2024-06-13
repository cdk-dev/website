'use server'

import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { AuthGetCurrentUserServer } from '@/utils/amplifyServerUtils';
import { z } from 'zod';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

const linkSuggestionSchema = z.object({
  url: z.string().url(),
  comment: z.string().min(1)
});

export const fetchPosts = async () => {
  const currentUser = await AuthGetCurrentUserServer();
  if (!currentUser) {
    throw new Error('User is not authenticated');
  }
  console.log('currentUser', currentUser);
  const { data: posts, errors } = await cookieBasedClient.models.Post.list();
  console.log({posts});
  if (errors) {
    console.error(errors);
  }
  return posts;
};

export const addLinkSuggestion = async (formData: FormData) => {
  const currentUser = await AuthGetCurrentUserServer();
  if (!currentUser) {
    throw new Error('User is not authenticated');
  }
  const parsedData = linkSuggestionSchema.safeParse({
    url: formData.get('url'),
    comment: formData.get('comment'),
  });

  if (!parsedData.success) {
    console.error(parsedData.error);
    return null;
  }

  const { data: linkSuggestion, errors } = await cookieBasedClient.models.LinkSuggestion.create(parsedData.data);
  console.log({linkSuggestion});
  if (errors) {
    console.error(errors);
  }
  revalidateTag('posts') // Update cached posts
  redirect('/')
};