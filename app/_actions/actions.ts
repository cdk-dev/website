'use server'

import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { authSession } from '@/utils/amplifyServerUtils';
import { z } from 'zod';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { SNSClient, SubscribeCommand } from '@aws-sdk/client-sns';

import amplify from '@/amplify_outputs.json';

const linkSuggestionSchema = z.object({
  url: z.string().url(),
  comment: z.string().optional()
});

export const fetchPosts = async (limit: number = 3) => {
  const { data: posts, errors } = await cookieBasedClient.models.Post.list({
    limit,
    selectionSet: [
      'id',
      'title',
      'banner',
      'url',
      'content',
      'categories',
      'createdAt',
      'updatedAt',
      'author.*',
    ],
    sortDirection: 'DESC'
  });
  if (errors) {
    console.error(errors);
  }
  return posts;
};

// pending fix https://github.com/aws-amplify/amplify-category-api/issues/2621
export const fetchMostRecentPosts = async (limit: number = 3) => {
  const posts = await fetchPosts(200);
  return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
};

export const addLinkSuggestion = async (prevState: any, formData: FormData) => {
  const parsedData = linkSuggestionSchema.safeParse({
    url: formData.get('url'),
    comment: formData.get('comment'),
  });

  if (!parsedData.success) {
    console.error(parsedData.error);
    return {
      errors: parsedData.error.message
    };
  }

  const { data: linkSuggestion, errors } = await cookieBasedClient.models.LinkSuggestion.create(parsedData.data);
  console.log({linkSuggestion});
  if (errors) {
    console.error(errors);
  }
  revalidateTag('posts') // Update cached posts
  redirect('/')
};

export const fetchResources = async (limit: number = 3) => {
  const { data: resources, errors } = await cookieBasedClient.models.Resource.list({
    limit,
    selectionSet: [
      'id',
      'title',
      'content',
      'url',
      'categories',
      'banner',
      'createdAt',
      'updatedAt',
    ],
    sortDirection: 'DESC'
  });
  if (errors) {
    console.error(errors);
  }
  return resources;
};

// pending fix https://github.com/aws-amplify/amplify-category-api/issues/2621
export const fetchMostRecentResources = async (limit: number = 3) => {
  const resources = await fetchResources(200);
  return resources.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
};

export const subscribeToNewsletter = async (formData: FormData) => {
  const session = await authSession();
  console.log({session});

  if (!session) {
    throw new Error('User is not authenticated');
  }

  const snsClient = new SNSClient({
    credentials: session.credentials,
    region: amplify.auth.aws_region,
  });

  const email = formData.get('email') as string;

  try {
    const command = new SubscribeCommand({
      Protocol: 'email',
      TopicArn: amplify.custom.subscribersTopicArn,
      Endpoint: email,
    });

    const response = await snsClient.send(command);
    console.log('Subscription successful:', response);
  } catch (error) {
    console.error('Error subscribing to SNS:', error);
  }
};