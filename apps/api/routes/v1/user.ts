import Router from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => {
    res.send("Hello i am here")
});

export default userRouter;
