import * as user from "./def/user";
import * as theme from "./def/theme";
import * as budget from "./def/budget";
import * as category from "./def/category";
import * as oauthAccount from "./def/oauth-account";

const schema = {
  ...user,
  ...theme,
  ...budget,
  ...category,
  ...oauthAccount,
};

export default schema;
