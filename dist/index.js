"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const ItemsController_1 = require("./controllers/ItemsController");
const RatingController_1 = require("./controllers/RatingController");
const AuthController_1 = require("./controllers/AuthController");
const CommentsController_1 = require("./controllers/CommentsController");
const CategoriesController_1 = require("./controllers/CategoriesController");
const NotificationController_1 = require("./controllers/NotificationController");
const SubscribeController_1 = require("./controllers/SubscribeController");
const app = (0, express_1.default)();
const itemsController = new ItemsController_1.ItemsController();
const ratingController = new RatingController_1.RatingController();
const authController = new AuthController_1.AuthController();
const commentsController = new CommentsController_1.CommentsController();
const categoriesController = new CategoriesController_1.CategoriesController();
const notificationController = new NotificationController_1.NotificationController();
const subscribeController = new SubscribeController_1.SubscribeController();
app.use(express_1.default.static('public'));
app.use(express_1.default.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
;
app.use((0, express_session_1.default)({ secret: "Secret", resave: false, saveUninitialized: true }));
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
app.get("/", (req, res) => {
    itemsController.home(req, res);
});
app.get("/categories/:id", (req, res) => {
    categoriesController.index(req, res);
});
app.get("/filters/:id", (req, res) => {
    categoriesController.filters(req, res);
});
app.get("/bySubscribe/:id", (req, res) => {
    subscribeController.BySubscribe(req, res);
});
app.get("/forfree/:id", (req, res) => {
    subscribeController.forFree(req, res);
});
//FILTERS//
app.get("/from/movies/:id", (req, res) => {
    categoriesController.movies(req, res);
});
app.get("/from/country/:name", (req, res) => {
    categoriesController.ByCountry(req, res);
});
app.get("/from/years/:date", (req, res) => {
    categoriesController.ByYear(req, res);
});
app.get("/types/free", (req, res) => {
    categoriesController.free(req, res);
});
app.get("/types/subscribe", (req, res) => {
    categoriesController.subscribe(req, res);
});
app.get("/from/cartoons/:id", (req, res) => {
    categoriesController.cartoons(req, res);
});
app.get("/movies", (req, res) => {
    categoriesController.movies(req, res);
});
//AUTH//
app.get("/register", (req, res) => {
    authController.renderRegistration(req, res);
});
app.post("/register", (req, res) => {
    authController.registerForm(req, res);
});
app.get("/logout", (req, res) => {
    authController.logout(req, res);
});
// app.get("/login", (req: Request, res: Response) => {
//   authController.renderLogin(req, res);
// });
app.get("/registration", (req, res) => {
    authController.renderRegistration(req, res);
});
// app.get("/loginForm", (req: Request, res: Response) => {
//   authController.renderLogin(req, res);
// });
app.post("/login", (req, res) => {
    authController.login(req, res);
});
app.get("/enter", (req, res) => {
    authController.renderLogin(req, res);
});
app.get("/items/create", (req, res) => {
    itemsController.Add(req, res);
});
app.post("/AddItems", (req, res) => {
    itemsController.AddItems(req, res);
});
app.post("/arrange", (req, res) => {
    subscribeController.arrange(req, res);
});
app.post("/disarrange", (req, res) => {
    subscribeController.disarrange(req, res);
});
app.post("/searchAllFilms", (req, res) => {
    itemsController.homeSearch(req, res);
});
app.get("/subscribe", (req, res) => {
    subscribeController.RenderSubscribe(req, res);
});
app.get("/home", (req, res) => {
    itemsController.home(req, res);
});
app.get("/bascet__btn", (req, res) => {
    itemsController.bascet(req, res);
});
app.get("/profile", (req, res) => {
    itemsController.profile(req, res);
});
app.get("/users", (req, res) => {
    itemsController.users(req, res);
});
app.post("/delete/users/:id", (req, res) => {
    itemsController.delete__users(req, res);
});
app.post("/delete/comment/:id", (req, res) => {
    commentsController.delete__comment(req, res);
});
app.get("/cart", (req, res) => {
    itemsController.bascet(req, res);
});
app.get("/addGenres", (req, res) => {
    itemsController.addGenre(req, res);
});
app.post("/addGenres", (req, res) => {
    itemsController.createGenre(req, res);
});
app.get("/addCategories", (req, res) => {
    itemsController.addCategories(req, res);
});
app.post("/addCategories", (req, res) => {
    itemsController.createCategories(req, res);
});
app.get("/description", (req, res) => {
    itemsController.renderDes(req, res);
});
app.post("/save__Video", (req, res) => {
    itemsController.save__Video(req, res);
});
app.get("/save__Video", (req, res) => {
    itemsController.bascet(req, res);
});
app.post("/delete__Video/:id", (req, res) => {
    itemsController.delete__Video(req, res);
});
app.get("/bascet", (req, res) => {
    itemsController.bascet(req, res);
});
app.get("/des__film/:id", (req, res) => {
    itemsController.description(req, res);
});
app.post("/rating/:id", (req, res) => {
    ratingController.rating(req, res);
});
app.post("/home", (req, res) => {
    itemsController.searchMove(req, res);
});
app.post("/delete__movies/:id", (req, res) => {
    itemsController.delete__moves(req, res);
});
app.post("/search/byGenre/:id", (req, res) => {
    categoriesController.movies(req, res);
});
