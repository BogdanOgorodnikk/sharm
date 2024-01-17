import notFound from "@/router/pages/error/notFound";
import forbidden from "@/router/pages/error/forbidden";

const error = [...notFound, ...forbidden];

export default error;
