const whitelist = ["http://localhost:3000", "http://localhost:5173", "https://pizza-store-p2z4.onrender.com"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("not allowed by cors"));
    }
  },
  optionsSucessStatus: 200,
  credentials: true
};

export default corsOptions;