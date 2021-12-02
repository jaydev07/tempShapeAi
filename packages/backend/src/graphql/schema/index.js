import gql from 'graphql-tag';
import { mergeTypes } from 'merge-graphql-schemas';

import auth from './auth';
import custom from "./custom";
import user from './user';
import course from './course.js';
import upload from './upload';
import certificate from './certificate';

const linkSchema = gql`
    type Query {
        _: Boolean
    }

    type Mutation {
        _: Boolean
    }

    type Subscription {
        _: Boolean
    }
`;

export default mergeTypes(
	[
		linkSchema,
		custom,
		user,
		auth,
		course,
		upload,
		certificate,
	],
	{ all: true }
);