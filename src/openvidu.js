const axios = require('axios');
const https = require('https');

class OpenVidu {
  constructor(url, username, password) {
    this.url = url;
    this.apiPath = `${this.url}/api/`;

    console.log(`Creating OpenVidu instance with ${username}@${url}`);

    this.axios = axios.create({
      baseURL: `${url}/api/`,
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      }),
      auth: {
        username: username,
        password: password
      },
    });
  }

  getUrl(endpoint) {
    return `${this.url}/api/${endpoint}`;
  }

  post(path, data) {
    return this.axios.request({
      url: path,
      method: 'post',
      data,
    });
  }

  get(path) {
    return this.axios.request({
      url: path,
      method: 'get',
    });    
  }

  async initSession() {
    console.log('Creating OpenVidu Session');

    try {
      const response = await this.post('sessions', {
        mediaMode: 'ROUTED',
        recordingMode: 'ALWAYS',
      }).then((resp) => {
        return resp.data;
      });

      return {
        id: response.id,
        createdAt: response.createdAt,
      };
    } catch(e) {
      console.error(e);
    }
  }

  async recreateSessionIfNotExists(sessionId) {
    try {
      const response = await this.get(`sessions/${sessionId}`).then((resp) => {
        return resp.data;
      });

      return response.sessionId; 
    } catch(e) {
      if (e.response.status == 404) {
        // Recreate session
        console.log('Recreating OpenVidu Session');
        const data = await this.initSession();
        return data.id;
      } else {
        return null;
      }
    }    
  }  

  async getAccessToken(sessionId, role, data) {
    console.log('Creating OpenVidu AccessToken for session', sessionId);
    if (!sessionId) return null;

    try {
      const response = await this.post('tokens', {
        session: sessionId,
        role,
        data,
      }).then((resp) => {
        return resp.data;
      });

      return {
        token: response.token,
        session: response.session,
        role: response.role,
        data: response.data,
        id: response.id,
        kurentoOptions: response.kurentoOptions,
      };    
    } catch(e) {
      console.error(e);
    }
  }
}

module.exports = function (app) {
  const connectionString = app.get('openvidu');
  const openViduUsername = app.get('openviduUsername');
  const openViduPassword = app.get('openviduPassword');
  
  app.set('OpenViduService', new OpenVidu(connectionString, openViduUsername, openViduPassword));
};
