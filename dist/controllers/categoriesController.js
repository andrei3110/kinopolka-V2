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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesController = void 0;
const client_1 = require("@prisma/client");
// import "./authorizationcontroller"
const prisma = new client_1.PrismaClient();
class CategoriesController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            let categories = yield prisma.categories.findMany({});
            let items = yield prisma.items.findMany({
                where: {
                    type: Number(id),
                }
            });
            const genres = yield prisma.genres.findMany({});
            const cartoons = yield prisma.cartoonGenres.findMany({});
            const filters = yield prisma.filters.findMany({});
            req.session.category = Number(id);
            res.render('types/index', {
                auth: req.session.auth,
                active: req.session.active,
                admin: req.session.admin,
                status: req.session.status,
                category: req.session.category,
                count: req.session.count,
                'items': items,
                'categories': categories,
                'genres': genres,
                'filters': filters,
                'cartoonGenres': cartoons
            });
        });
    }
    movies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const genres = yield prisma.genres.findMany({
                where: {
                    id: Number(id)
                },
                select: {
                    Items: {
                        select: {
                            relItem: {
                                select: {
                                    id: true
                                }
                            }
                        }
                    }
                },
            });
            let arr = [];
            for (let i = 0; i < genres[0].Items.length; i++) {
                arr.push(genres[0].Items[i].relItem.id);
            }
            for (let i = 0; i < arr.length; i++) {
            }
            const items = yield prisma.items.findMany({
                where: {
                    id: {
                        in: arr,
                    },
                    type: Number(req.session.category)
                }
            });
            const categories = yield prisma.categories.findMany({});
            const filters = yield prisma.filters.findMany({});
            res.render('types/movies', {
                auth: req.session.auth,
                active: req.session.active,
                status: req.session.status,
                admin: req.session.admin,
                category: req.session.category,
                count: req.session.count,
                'categories': categories,
                'items': items,
                'filters': filters,
                'genres': genres,
            });
        });
    }
    search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const genre = yield prisma.genres.findMany({
                where: {
                    id: Number(id)
                },
                select: {
                    Items: {
                        select: {
                            relItem: {
                                select: {
                                    id: true
                                }
                            }
                        }
                    }
                },
            });
            let arr = [];
            for (let i = 0; i < genre[0].Items.length; i++) {
                arr.push(genre[0].Items[i].relItem.id);
            }
            for (let i = 0; i < arr.length; i++) {
            }
            //    const items = await prisma.items.findMany({})
            if (arr.length != 0) {
                req.session.searchMove = true;
            }
            else {
                req.session.searchMove = false;
            }
            const items = yield prisma.items.findMany({
                where: {
                    id: {
                        in: arr,
                    },
                }
            });
            const genres = yield prisma.genres.findMany({});
            const categories = yield prisma.categories.findMany({});
            const filters = yield prisma.filters.findMany({});
            res.render('search', {
                'categories': categories,
                'items': items,
                'filters': filters,
                'genre': genre,
                'genres': genres,
                auth: req.session.auth,
                active: req.session.active,
                status: req.session.status,
                admin: req.session.admin,
                searchMove: req.session.searchMove,
                category: req.session.category,
                count: req.session.count,
            });
        });
    }
    cartoons(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.params;
            const genres = yield prisma.cartoonGenres.findMany({
                where: {
                    name
                }
            });
            const count = yield prisma.items.count({
                where: {
                    genre: {
                        contains: name
                    },
                    type: Number(req.session.category)
                }
            });
            if (count > 0) {
                let n = Math.ceil(count / 4);
                req.session.count = Math.ceil(count / 4);
                let itemsPerPage = 4;
                let page = Number(req.query.page);
                if (!page)
                    page = 1;
                if (page > n)
                    page = n;
                let pages = itemsPerPage * (page - 1);
                const items = yield prisma.items.findMany({
                    skip: pages,
                    take: itemsPerPage,
                    where: {
                        genre: {
                            contains: name
                        },
                        type: Number(req.session.category)
                    }
                });
                let k = 0;
                for (let i = 0; i < items.length; i++) {
                    k = k + 1;
                }
                const categories = yield prisma.categories.findMany({});
                const filters = yield prisma.filters.findMany({});
                res.render('types/movies', {
                    auth: req.session.auth,
                    status: req.session.status,
                    admin: req.session.admin,
                    active: req.session.active,
                    count: req.session.count,
                    category: req.session.category,
                    'items': items,
                    'cartoonGenres': genres,
                    'categories': categories,
                    'filters': filters
                });
            }
            else {
                const items = yield prisma.items.findMany({
                    where: {
                        genre: {
                            contains: name
                        },
                        type: Number(req.session.category)
                    }
                });
                const categories = yield prisma.categories.findMany({});
                const filters = yield prisma.filters.findMany({});
                res.render('types/movies', {
                    auth: req.session.auth,
                    status: req.session.status,
                    admin: req.session.admin,
                    active: req.session.active,
                    count: req.session.count,
                    category: req.session.category,
                    'items': items,
                    'cartoonGenres': genres,
                    'filters': filters,
                    'categories': categories,
                });
            }
        });
    }
    searchFilms(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.body;
            req.session.searchMove = false;
            const items = yield prisma.items.findMany({
                where: {
                    genre: {
                        contains: name
                    }
                }
            });
            if (items[0] != undefined) {
                req.session.searchMove = true;
            }
            else {
                req.session.searchMove = false;
            }
            const categories = yield prisma.categories.findMany({});
            const genres = yield prisma.genres.findMany({});
            res.render('search', {
                'genres': genres,
                'categories': categories,
                'items': items,
                searchMove: req.session.searchMove,
                auth: req.session.auth,
                status: req.session.status,
                count: req.session.count,
                active: req.session.active,
                admin: req.session.admin,
                mark: req.session.mark
            });
        });
    }
    ByYear(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { date } = req.params;
            const currentType = Number(req.session.category);
            const count = yield prisma.items.count({
                where: {
                    year: Number(date),
                    type: Number(req.session.category)
                }
            });
            if (count > 0) {
                let n = Math.ceil(count / 4);
                req.session.count = Math.ceil(count / 4);
                let itemsPerPage = 4;
                let page = Number(req.query.page);
                if (!page)
                    page = 1;
                if (page > n)
                    page = n;
                let pages = itemsPerPage * (page - 1);
                const items = yield prisma.items.findMany({
                    skip: pages,
                    take: itemsPerPage,
                    where: {
                        year: Number(date),
                        type: Number(req.session.category)
                    }
                });
                const filters = yield prisma.filters.findMany({});
                const categories = yield prisma.categories.findMany({});
                let k = 0;
                for (let i = 0; i < items.length; i++) {
                    k = k + 1;
                }
                res.render('types/movies', {
                    auth: req.session.auth,
                    status: req.session.status,
                    admin: req.session.admin,
                    active: req.session.active,
                    count: req.session.count,
                    category: req.session.category,
                    'filters': filters,
                    'items': items,
                    'categories': categories
                });
            }
            else {
                const categories = yield prisma.categories.findMany({});
                const items = yield prisma.items.findMany({
                    where: {
                        year: Number(date),
                        type: Number(req.session.category)
                    }
                });
                const filters = yield prisma.filters.findMany({});
                res.render('types/movies', {
                    auth: req.session.auth,
                    status: req.session.status,
                    admin: req.session.admin,
                    active: req.session.active,
                    count: req.session.count,
                    category: req.session.category,
                    'items': items,
                    'filters': filters,
                    'categories': categories
                });
            }
        });
    }
    ByGenre(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            req.session.active = "genre";
            const genres = yield prisma.genres.findMany({});
            const cartoons = yield prisma.cartoonGenres.findMany({});
            const categories = yield prisma.categories.findMany({});
            const filters = yield prisma.filters.findMany({});
            res.render('types/index', {
                auth: req.session.auth,
                count: req.session.count,
                status: req.session.status,
                admin: req.session.admin,
                active: req.session.active,
                category: req.session.category,
                'categories': categories,
                'genres': genres,
                'filters': filters,
                'cartoonGenres': cartoons
            });
        });
    }
    byFree(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            req.session.active = "free";
            const items = yield prisma.items.findMany({
                where: {
                    status: 'бесплатно'
                }
            });
            const categories = yield prisma.categories.findMany({});
            const filters = yield prisma.filters.findMany({});
            res.render('types/movies', {
                auth: req.session.auth,
                active: req.session.active,
                status: req.session.status,
                admin: req.session.admin,
                category: req.session.category,
                count: req.session.count,
                'categories': categories,
                'filters': filters,
                'items': items,
            });
        });
    }
    onPaid(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            req.session.active = "paid";
            const items = yield prisma.items.findMany({
                where: {
                    status: 'подписка'
                }
            });
            const categories = yield prisma.categories.findMany({});
            res.render('types/movies', {
                auth: req.session.auth,
                active: req.session.active,
                status: req.session.status,
                admin: req.session.admin,
                category: req.session.category,
                count: req.session.count,
                'categories': categories,
                'items': items,
            });
        });
    }
    ByCountry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.params;
            const currentType = Number(req.session.category);
            const count = yield prisma.items.count({
                where: {
                    country: {
                        contains: name
                    },
                    type: currentType
                }
            });
            if (count > 0) {
                let n = Math.ceil(count / 4);
                req.session.count = Math.ceil(count / 4);
                let itemsPerPage = 4;
                let page = Number(req.query.page);
                if (!page)
                    page = 1;
                if (page > n)
                    page = n;
                let pages = itemsPerPage * (page - 1);
                const items = yield prisma.items.findMany({
                    skip: pages,
                    take: itemsPerPage,
                    where: {
                        country: {
                            contains: name
                        },
                        type: currentType
                    }
                });
                let k = 0;
                for (let i = 0; i < items.length; i++) {
                    k = k + 1;
                }
                const categories = yield prisma.categories.findMany({});
                const filters = yield prisma.filters.findMany({});
                res.render('types/movies', {
                    auth: req.session.auth,
                    status: req.session.status,
                    admin: req.session.admin,
                    active: req.session.active,
                    count: req.session.count,
                    category: req.session.category,
                    'items': items,
                    'filters': filters,
                    'categories': categories
                });
            }
            else {
                const items = yield prisma.items.findMany({
                    where: {
                        country: {
                            contains: name
                        },
                        type: currentType
                    }
                });
                const categories = yield prisma.categories.findMany({});
                const filters = yield prisma.filters.findMany({});
                res.render('types/movies', {
                    auth: req.session.auth,
                    status: req.session.status,
                    admin: req.session.admin,
                    active: req.session.active,
                    count: req.session.count,
                    category: req.session.category,
                    'items': items,
                    'filters': filters,
                    'categories': categories
                });
            }
        });
    }
    subscribe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield prisma.items.findMany({
                where: {
                    status: 'подписка'
                }
            });
            const filters = yield prisma.filters.findMany({});
            const categories = yield prisma.categories.findMany({});
            res.render('types/movies', {
                auth: req.session.auth,
                active: req.session.active,
                status: req.session.status,
                admin: req.session.admin,
                category: req.session.category,
                count: req.session.count,
                'filters': filters,
                'categories': categories,
                'items': items,
            });
        });
    }
    free(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield prisma.items.findMany({
                where: {
                    status: 'бесплатно'
                }
            });
            const filters = yield prisma.filters.findMany({});
            const categories = yield prisma.categories.findMany({});
            res.render('types/movies', {
                auth: req.session.auth,
                active: req.session.active,
                status: req.session.status,
                admin: req.session.admin,
                category: req.session.category,
                count: req.session.count,
                'filters': filters,
                'categories': categories,
                'items': items,
            });
        });
    }
    filters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const filtersBar = yield prisma.filters.findMany({
                where: {
                    id: Number(id),
                }
            });
            const categories = yield prisma.categories.findMany({});
            const filters = yield prisma.filters.findMany({});
            const genres = yield prisma.genres.findMany({});
            const cartoonGenres = yield prisma.cartoonGenres.findMany({});
            const items = yield prisma.items.findMany();
            const country = yield prisma.country.findMany();
            const years = yield prisma.years.findMany();
            if (filtersBar[0].title == 'free' || filtersBar[0].title == 'subscribe') {
                res.redirect(`/types/${filtersBar[0].title}`);
            }
            else {
                res.render(`types/${filtersBar[0].title}`, {
                    'categories': categories,
                    'filtersBar': filtersBar,
                    'items': items,
                    'filters': filters,
                    'country': country,
                    'years': years,
                    'cartoonGenres': cartoonGenres,
                    'genres': genres,
                    auth: req.session.auth,
                    filter: req.session.filter,
                    status: req.session.status,
                    admin: req.session.admin,
                    active: req.session.active,
                    count: req.session.count,
                    category: req.session.category,
                });
            }
        });
    }
}
exports.CategoriesController = CategoriesController;
