const { MethodNotAllowed, NotAuthenticated, BadRequest } = require('@feathersjs/errors');

/* eslint-disable no-unused-vars */
exports.Register = class Register {
  constructor (options, app) {
    this.options = options || {};
    this.app = app;
  }

  async registerUser(model, email, password, additionalInfo) {
    try {
      const user = await model.create({ email, password });
      return user;
      
    } catch(e) {
      const [error] = e.errors;
      switch (error.type) {
        case 'unique violation':
          throw new NotAuthenticated('User already registered');

        default:
          throw e;
      }
    }
  }

  async find (params) {
    return new MethodNotAllowed();
  }

  async get (id, params) {
    return new MethodNotAllowed();
  }

  async create ({ role, email, password, additionalInfo }, params) {
    const ret = { role, email, };

    if (!role) throw new BadRequest('Role not specified');
    if (!email) throw new BadRequest('Email not specified');
    if (!password) throw new BadRequest('Password not specified');

    switch (role) {
      case 'artist': {
        const ArtistModel = this.app.service('artists').Model;
        const result = await this.registerUser(ArtistModel, email, password, additionalInfo);
        return result;
      }

      case 'viewer': {
        const ViewerModel = this.app.service('viewers').Model;
        const result = await this.registerUser(ViewerModel, email, password, additionalInfo);
        return result;
      }

      default:
        throw new BadRequest('Role must be either viewer or artist');
    }

    return null;
  }

  async update (id, data, params) {
    return new MethodNotAllowed();
  }

  async patch (id, data, params) {
    return new MethodNotAllowed();
  }

  async remove (id, params) {
    return new MethodNotAllowed();
  }
};
