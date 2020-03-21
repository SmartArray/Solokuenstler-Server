const { MethodNotAllowed, NotAuthenticated, BadRequest, GeneralError } = require('@feathersjs/errors');

/* eslint-disable no-unused-vars */
exports.Room = class Room {
  constructor (options, app) {
    this.options = options || {};
    this.app = app;
  }

  async find (params) {
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

      // Return appointments
      return {
        roomId,
      };

    } else if (params.artist != null) {
      // Role: Artist
      // Get own active appointment's room
      const { artist_id } = params.artist;
      const appointment = await this.app.service('/appointments').getCurrentAppointment(artist_id);
      const OpenViduService = this.app.get('OpenViduService');

      let roomId = appointment.room;
      if (!roomId) {
        // Create room if not created yet
        const openViduData = await OpenViduService.initSession();

        console.log(openViduData)

        roomId = openViduData.id;
        appointment.room = roomId;
        console.log(`Created new room ${roomId}`);
        await appointment.save({ fields: ['room'] });
      }

      const tokenId = `artist:${artist_id}`;

      // ToDo: Request api/sessions/{roomId}
      // Check if tokenId already exists
      // connections.content: [ { clientData } ]

      // Create access token
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
