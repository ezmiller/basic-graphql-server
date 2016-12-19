'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');
const { getVideoById, getVideos } = require('./src/data');


const PORT = process.env.PORT || 3000;
const server = express();

const videoType = new GraphQLObjectType({
  name: 'Video',
  description: 'A video on Egghead.io',
  fields: {
    id: {
      type: GraphQLID,
      description: 'The id of the video.',
    },
    title: {
      type: GraphQLString,
      description: 'The title of the video.',
    },
    duration: {
      type: GraphQLInt,
      description: 'The length in minutes of the video.',
    },
    watched: {
      type: GraphQLBoolean,
      description: 'Whether or not the viewer has watched the video.',
    }
  }
});

const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root query type',
  fields: {
    videos: {
      type: new GraphQLList(videoType),
      resolve: getVideos,
    },
    video: {
      type: videoType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'The id of the video.',
        },
      },
      resolve: (_, args) => getVideoById(args.id) 
    }
  }
});

const schema = new GraphQLSchema({
  query: queryType,
});


server.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

server.listen(PORT, () => {
  console.log('Listening on http://localhost:3000');
});
