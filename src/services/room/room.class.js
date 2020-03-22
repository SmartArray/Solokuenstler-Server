const { MethodNotAllowed, NotAuthenticated, BadRequest, GeneralError } = require('@feathersjs/errors');

/* eslint-disable no-unused-vars */
exports.Room = class Room {
  constructor (options, app) {
    this.options = options || {};
    this.app = app;
  }

  async find (params) {
    const OpenViduService = this.app.get('OpenViduService');

    if (params.viewer != null) {
      // Role: Viewer
      const AppointmentsModel = this.app.service('/appointments').Model;
      const { appointmentId } = params.query;
      if (!appointmentId) throw new BadRequest('appointmentId not specified');

      const appointment = await AppointmentsModel.findOne({ where: { id: appointmentId } });

      // ToDo: Check permissions
      // ...

      const roomId = appointment.room;
      if (!roomId) {
        throw new GeneralError('Room not available yet');
      }

      // Create access token
      const tokenId = `viewer|${params.viewer.email}`;
      const accessToken = await OpenViduService.getAccessToken(roomId, 'SUBSCRIBER', tokenId);
      if (!accessToken) return {
        message: 'error',
        description: 'Could not create access token',
      };      

      // Return appointments
      return {
        roomId,
        token: accessToken.token,
      };

    } else if (params.artist != null) {
      // Role: Artist
      // Get own active appointment's room
      const { artist_id } = params.artist;
      const appointment = await this.app.service('/appointments').getCurrentAppointment(artist_id);

      let roomId = appointment.room;
      if (!roomId) {
        // Create room if not created yet
        const openViduData = await OpenViduService.initSession();
        roomId = openViduData.id;
        appointment.room = roomId;
      } else {
        // Check if we need to recreate
        roomId = await OpenViduService.recreateSessionIfNotExists(roomId);
        if (!roomId) {
          throw new GeneralError('Unable to recreate session');
        }
      }

      // Update entry in database
      appointment.room = roomId;
      await appointment.save({ fields: ['room'] });

      // Create access token
      const tokenId = `artist|${artist_id}`;
      const accessToken = await OpenViduService.getAccessToken(roomId, 'PUBLISHER', tokenId);
      if (!accessToken) return {
        message: 'error',
        description: 'Could not create access token',
      };

      return {
        roomId: roomId,
        token: accessToken.token,
      };
    }

    throw new NotAuthenticated();
  }

  async get (id, params) {
    throw new MethodNotAllowed();
  }

  async create (data, params) {
    throw new MethodNotAllowed();
  }

  async update (id, data, params) {
    throw new MethodNotAllowed();
  }

  async patch (id, data, params) {
    throw new MethodNotAllowed();
  }

  async remove (id, params) {
    throw new MethodNotAllowed();
  }
};
