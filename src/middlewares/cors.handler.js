const whitelist = ["http://localhost:3000", "http://localhost:5173"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("not allowed by cors"));
    }
  },
  optionsSucessStatus: 200,
};

export default corsOptions;