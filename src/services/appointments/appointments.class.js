const { Service } = require('feathers-sequelize');
const { BadRequest, GeneralError } = require('@feathersjs/errors');

exports.Appointments = class Appointments extends Service {
  constructor(options, app) {
    super(options, app);
    this.app = app;
  }

  async getCurrentAppointment(artistId) {
    const ArtistsModel = this.app.service('/artists').Model;
    const artist = await ArtistsModel.findOne({ where: { artist_id: artistId, } });
    const appointments = await artist.getAppointments({ order: [[ 'date', 'DESC' ]] });

    if (appointments.length == 0)
      throw new GeneralError('No upcoming or active appointment');

    // ToDo: Retrieve active or upcoming appointment.
    // That is:
    //   Check if either
    //   - current date is in the range (appointment.date, appointment.date + duration), or
    //   - the first candidate that will be future

    return appointments[0];
  }

  async find(params) {
    if (params.viewer != null) {
      // Role: Viewer
      const ArtistsModel = this.app.service('/artists').Model;
      const { artistId } = params.query;
      if (!artistId) throw new BadRequest('artistId not specified');

      const artist = await ArtistsModel.findOne({ where: { artist_id: artistId } });
      if (!artist) throw new GeneralError('Artist does not exist');

      // Return appointments
      return await artist.getAppointments();

    } else if (params.artist != null) {
      // Role: Artist
      // Get own appointments
      const { artist_id } = params.artist;
      const ArtistsModel = this.app.service('/artists').Model;
      const artist = await ArtistsModel.findOne({ where: { artist_id, } });

      // Return appointments
      return await artist.getAppointments();
    }

    return {};
  }

  async create(data, params) {
    const { artist } = params;
    const ArtistsModel = this.app.service('/artists').Model;
    const AppointmentsModel = this.app.service('/appointments').Model;

    // Get artist
    const currentUser = await ArtistsModel.findOne({ where: { artist_id: artist.artist_id } });

    // ToDo: Check appointment collision 
    // ...

    // Create the appointment
    const appointment = await AppointmentsModel.create(data);

    // Add appointment
    await currentUser.addAppointment(appointment);

    return {
      message: 'success',
      appointment
    };
  }
};
