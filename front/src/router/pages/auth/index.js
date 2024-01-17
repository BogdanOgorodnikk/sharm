import login from "@/router/pages/auth/login";
import forgot from "@/router/pages/auth/forgot";
import signup from "@/router/pages/auth/signup";

const auth = [...login, ...forgot, ...signup];

export default auth;
