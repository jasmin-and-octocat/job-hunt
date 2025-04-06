export default {
  beforeCreate(event) {
    const { data } = event.params;

    // Get the authenticated user from the context
    const userId = event.state.auth.credentials.id;

    // Set the user relation automatically using the correct field name
    data.users_permissions_user = userId;
  },
};
