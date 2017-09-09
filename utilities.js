getUserName = ({ first_name, last_name, username }) =>
  first_name ? `${first_name}${last_name ? " " + last_name : ""}` : username;

module.exports = {
  getUserName
};
