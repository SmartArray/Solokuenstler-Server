const { LocalStrategy } = require('@feathersjs/authentication-local');
const { NotAuthenticated } = require('@feathersjs/errors');

module.exports = class SKAuthenticationStrategy extends LocalStrategy {
  constructor(serviceName, entity) {
    super();
    this.serviceName = serviceName;
    this.entity = entity;
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

  async getEntity(result, params) {
    const { serviceName } = this;
    const entityService = this.app.service(serviceName);
    const entityId = entityService.id;

    if (!entityId || result[entityId] === undefined) {
      throw new NotAuthenticated('Could not get local entity');
    }

    if (!params.provider) {
      return result;
    }

    return entityService.get(result[entityId], {
      ...params,
      [serviceName]: result
    });    
  }
};