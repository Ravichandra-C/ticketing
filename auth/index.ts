import { app } from "./app";
import { connectDb } from "./util/db/connectDb";
connectDb()
  .then(() => {
    app.listen("3000", () =>
      console.log("Auth Server is running on port 3000")
    );
  })
  .catch((err) => console.log(err));
