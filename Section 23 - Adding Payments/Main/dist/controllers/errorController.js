"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get500ErrorPage = exports.getPageNotFound = void 0;
const getPageNotFound = (req, res) => {
    const { isLoggedIn } = req.session;
    res.status(404).render('error/404', {
        docTitle: 'Page not found!',
        path: '/error/404',
        isLoggedIn: isLoggedIn,
    });
};
exports.getPageNotFound = getPageNotFound;
const get500ErrorPage = (req, res) => {
    const { isLoggedIn } = req.session;
    res.status(500).render('error/500', {
        docTitle: 'Something went wrong',
        path: '/error/500',
        isLoggedIn: isLoggedIn,
    });
};
exports.get500ErrorPage = get500ErrorPage;
//# sourceMappingURL=errorController.js.map