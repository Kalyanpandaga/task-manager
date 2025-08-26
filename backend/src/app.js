import express from "express";
import cors from "cors";
import helmet from "helmet";
import corsOptions from "./config/corsOptions.js";

const app = express();
app.use(helmet());

app.use(cors(corsOptions));

app.use(express.json());

import authRouter from "./routes/auth.routes.js";
import taskRouter from "./routes/task.routes.js";
import userRouter from "./routes/user.routes.js";

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/users", userRouter);

export default app;
