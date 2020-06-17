const getPageNotFound = (req, res) => {
    res.status(404).render("404", {
        docTitle: "Page not found!",
    });
}

module.exports = {
    getPageNotFound
}