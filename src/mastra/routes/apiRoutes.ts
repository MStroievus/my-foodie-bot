import { chatEndpoint } from "./chatEndpoint";
import { frontendRoute } from "./frontendroute";
import { workflowEndpoint } from "./workflow";

export const apiRoutes = [
    chatEndpoint,
    workflowEndpoint,
    frontendRoute
]