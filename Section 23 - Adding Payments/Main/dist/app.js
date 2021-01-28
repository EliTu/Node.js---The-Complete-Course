"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Packages
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const csurf_1 = __importDefault(require("csurf"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const multer_1 = __importDefault(require("multer"));
const mongodbSessionStore = require('connect-mongodb-session')(express_session_1.default);
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const admin_1 = __importDefault(require("./routes/admin"));
const shop_1 = __importDefault(require("./routes/shop"));
const error_1 = __importDefault(require("./routes/error"));
// Files
const errorController_1 = require("./controllers/errorController");
const user_1 = __importDefault(require("./models/user"));
// Paths
const assetImagesPath = path_1.default.join(__dirname, 'assets', 'images');
const viewsPath = path_1.default.join(__dirname, 'views');
const publicPath = path_1.default.join(__dirname, 'public');
const distPath = path_1.default.join(__dirname, '../', 'dist');
const MONGODB_URI = 'mongodb+srv://eliad91:Et@081991@cluster0.n3tbe.mongodb.net/Cluster0?retryWrites=true&w=majority';
const app = express_1.default();
const store = new mongodbSessionStore({
    uri: MONGODB_URI,
    collection: 'sessions',
});
// init CSRF token service with csurf
const csrfProtection = csurf_1.default();
// set a multer storage engine to handle file storage on the memory by setting destination folder and file names
const fileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // call the cb function and pass null for error to indicate operation success and set a destination folder
        cb(null, assetImagesPath);
    },
    filename: (req, file, cb) => {
        // call the cb function and set a unique file name by combining the filenames with a unique string
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
// set a storage file filter validation function to pass it to multer in order to filter files based on file mimetype property
const multerFilter = (req, file, cb) => {
    // call the cb function with true to accept and store the file, or false to deny the file
    const [, imageType] = file.mimetype.split('/');
    if (imageType === 'png' ||
        imageType === 'jpg' ||
        imageType === 'jpeg' ||
        imageType === 'gif') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
// Set a template engine global value
app.set('view engine', 'pug');
app.set('views', viewsPath);
// Set body parser middleware to parse plain text requests (like forms)
app.use(body_parser_1.default.urlencoded({
    extended: false,
}));
// set multer middleware to scan for enctype=multipart requests (files. images etc) and parse them correctly, use the fileStorage as the engine, and fileFilter for validation
app.use(multer_1.default({ storage: fileStorage, fileFilter: multerFilter }).single('imageUrl'));
// Register a session middleware
app.use(express_session_1.default({
    secret: 'this is a secret',
    resave: false,
    saveUninitialized: false,
    store: store,
}));
// register the CSRF protection as a middleware
app.use(csrfProtection);
// init the connect-flash as a middleware to flash (store and then remove) data in sessions (must be init only after init the session)
app.use(connect_flash_1.default());
// set the mongoose user document found in the DB by looking up the userId in the session
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.session.user)
        return next();
    try {
        const user = yield user_1.default.findById(req.session.user);
        if (!user)
            next();
        req.user = user;
        return next();
    }
    catch (error) {
        throw new Error(error);
    }
}));
// serve CSS statically from the public folder
app.use(express_1.default.static(publicPath));
// serve the dist folder to access the .js script files on public/scripts
app.use(express_1.default.static(distPath));
// serve the image files statically
app.use('/assets/images', express_1.default.static(assetImagesPath));
// set a middleware that will declare common local variables that will be available for every req/res and is passable to any view that is being rendered
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken(); // register a valid csrf token for every POST request
    next();
});
// shop/admin routes
app.use(auth_1.default);
app.use('/admin', admin_1.default);
app.use(shop_1.default);
// error routes
app.use(error_1.default);
// 404 catch all middleware
app.use(errorController_1.getPageNotFound);
// define an error handling middleware (defined by setting error as first argument) to let express handle incoming errors (by calling next with an error object)
app.use((error, req, res, next) => {
    // render the 500 error page when this middleware is reached
    return res.status(500).render('error/500', {
        docTitle: 'Something went wrong',
        path: '/error/500',
        isLoggedIn: req.session.isLoggedIn,
        error,
    });
});
mongoose_1.default
    .connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
})
    .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Connected on port: ${port}`));
})
    .catch((err) => console.log(err));
//# sourceMappingURL=app.js.map