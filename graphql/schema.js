const graphql = require("graphql");
const {gql} = require("apollo-server-hapi");
const Painting  = require('../models/Painting');

const schema = gql`
input inputPainting {
  name: String!,
  url: String!,
  techniques: [String]!,
}
type Painting {
  name: String,
  id: String,
  techniques: String,
  url: String,
}
type Query {
  paintings: [Painting]
}
type Mutation {
  savePainting(payload: inputPainting): Painting, 
}
`;

module.exports = schema;