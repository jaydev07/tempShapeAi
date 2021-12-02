import { gql } from "@apollo/client";

export const ARCHIVE_COURSE_QUERY = gql`
  mutation changeCourseArchiveStatus($id: String, $archive: Boolean) {
    changeCourseArchiveStatus(id: $id, archive: $archive)
  }
`;
