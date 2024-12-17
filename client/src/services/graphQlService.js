import { GRAPHQL_API } from "constants";
import { requestService } from "utils/request";

const post = (data) => {
  return requestService.post(GRAPHQL_API, data);
};

export const graphQlService = { post };
