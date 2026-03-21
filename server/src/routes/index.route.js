import userRoute from "./management/user.route.js";

const Routes = (app) => {

    const api_prefix_v1 = "/api/v1";

    app.use(`${api_prefix_v1}/user`, userRoute);

}

export default Routes;
