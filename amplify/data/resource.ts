import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Feedback: a
    .model({
      title: a.string().required(),
      comment: a.string().required(),
      rating: a.integer(),
      submittedBy: a.string(),
    })
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});