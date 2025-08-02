import * as user from "./def/user";
import * as theme from "./def/theme";
import * as budget from "./def/budget";
import * as category from "./def/category";
import * as userTheme from "./def/user-theme";
import * as oauthAccount from "./def/oauth-account";
import * as userCategory from "./def/user-category";

const schema = {
  ...user,
  ...theme,
  ...budget,
  ...category,
  ...userTheme,
  ...oauthAccount,
  ...userCategory,
};

export default schema;
