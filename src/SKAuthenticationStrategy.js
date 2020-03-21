const { NotAuthenticated } = require('@feathersjs/errors');

module.exports = class SKAuthenticationStrategy extends LocalStrategy {
  constructor(serviceName) {
    super();
    this.serviceName = serviceName;
  }

  async findEntity(username, params) {
    const { serviceName } = this;
    const { entityUsernameField, errorMessage } = this.configuration;

    const query = await this.getEntityQuery({
      [entityUsernameField]: username,
    });

    const entityService = this.app.service(serviceName);

    const result = await entityService.find({
      query,
      skipHooks: ['protect.password'],
    });

    const list = Array.isArray(result) ? result : result.data;

    if (!Array.isArray(list) || list.length === 0) {
      throw new NotAuthenticated(errorMessage);
    }

    return list[0];
  }
};