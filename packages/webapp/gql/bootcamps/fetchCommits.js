import { gql } from "@apollo/client";

export const FETCH_COMMIT_DATA_QUERY = gql`
  query getHeatmapData($userId: String) {
    getHeatmapData(userId: $userId) {
      count
      date
    }
  }
`;
