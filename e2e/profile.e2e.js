import request from 'supertest';
import createApp from '../src/app';

describe("testing the profile route", () => {
  let app = null;
  let server = null;
  let api = null;
  let accessToken = null;
  
  beforeAll(() => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);
  });

  describe("GET /profile", () => {
    beforeAll(async () => {
        const input = {
          email: "facundo@correo.com",
          password: "fafafa123456",
        };
        const { body: bodyLogin } = await api.post("/api/v1/login").send(input);
        accessToken = bodyLogin.accessToken;
      });


    test("should receive a status code 400", async () => {
      const { statusCode } = await api.post("/api/v1/product")
        .set('Authorization', `Bearer ${accessToken}`).send(); 
        expect(statusCode).toEqual(400);
    })
  })

  afterAll(async () => {
    await server.close(); 
  })
})