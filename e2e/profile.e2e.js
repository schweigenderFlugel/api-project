import request from 'supertest';
import createApp from '../src/app';

describe("testing the profile route", () => {
  let app = null;
  let server = null;
  let api = null;
  let accessToken = null;
  let profile = null;
  
  beforeAll(() => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);
  });

  describe("GET /profile", () => {
    beforeAll(async () => {
        const input = {
          email: "facundoez@correo.com",
          password: "fafafa1234",
        };
        const { body: bodyLogin } = await api.post("/api/v1/login").send(input);
        accessToken = bodyLogin.accessToken;
        profile = bodyLogin.profile;
      });

    test("should receive a status code 401", async () => {
      const { statusCode } = await api.get(`/api/v1/profile/${profile}`).send(); 
        expect(statusCode).toEqual(401);
    })

    test("should receive a status code 200", async () => {
      const { statusCode } = await api.get(`/api/v1/profile/${profile}`)
        .set('Authorization', `Bearer ${accessToken}`).send(); 
        expect(statusCode).toEqual(200);
    })
  })

  afterAll(async () => {
    await server.close(); 
  })
})