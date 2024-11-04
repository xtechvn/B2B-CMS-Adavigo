const newsServices = {
    getNewsCategory: function () {
        return ajaxServices.get(CONSTANTS.DOMAIN + CONSTANTS.NEWS.APIS.getNewsCategory)
    },

    getMostViewedArticles: function () {
        return ajaxServices.get(CONSTANTS.DOMAIN + CONSTANTS.NEWS.APIS.getMostViewedArticles)
    },

    getNewsByCategoryId: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.NEWS.APIS.getNewsByCategoryId, request)
    },

    getNewsByCategoryIdV2: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.NEWS.APIS.getNewsByCategoryIdV2, request)
    },

    getNewsByTag: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.NEWS.APIS.getNewsByTag, request)
    },

    findArticle: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.NEWS.APIS.findArticle, request)
    },


}

