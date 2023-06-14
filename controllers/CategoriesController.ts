import { Request, Response } from 'express';
import { items, users, basket, items__genres, genres, years, comments, filters, categories, cartoonGenres, country, PrismaClient } from '@prisma/client';
import { validateHeaderValue } from 'http';
// import "./authorizationcontroller"
const prisma: PrismaClient = new PrismaClient();

export class CategoriesController {
    async index(req: Request, res: Response) {
        const { id } = req.params;

        let categories = await prisma.categories.findMany({});
        let items = await prisma.items.findMany({
            where: {
                type: Number(id),
            }
        });

        const genres = await prisma.genres.findMany({})
        const cartoons = await prisma.cartoonGenres.findMany({})
        const filters = await prisma.filters.findMany({})
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
    }

    async movies(req: Request, res: Response) {
        const { id } = req.params;
        const genres = await prisma.genres.findMany({
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

        })

        let arr = []
        for (let i = 0; i < genres[0].Items.length; i++) {

            arr.push(genres[0].Items[i].relItem.id)


        }
        for (let i = 0; i < arr.length; i++) {

        }
        const items = await prisma.items.findMany({
            where: {
                id: {
                    in: arr,

                },
                type: Number(req.session.category)
            }
        })
        const categories = await prisma.categories.findMany({});
        const filters = await prisma.filters.findMany({})

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
        })

    }

    async search(req: Request, res: Response) {
        const { id } = req.params;

        const genre = await prisma.genres.findMany({

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

        })

        let arr = []
        for (let i = 0; i < genre[0].Items.length; i++) {

            arr.push(genre[0].Items[i].relItem.id)

        }
        for (let i = 0; i < arr.length; i++) {

        }
        //    const items = await prisma.items.findMany({})
        if (arr.length != 0) {
            req.session.searchMove = true
        } else {
            req.session.searchMove = false
        }
        const items = await prisma.items.findMany({
            where: {
                id: {
                    in: arr,
                },
            }
        })
        const genres = await prisma.genres.findMany({})
        const categories = await prisma.categories.findMany({});
        const filters = await prisma.filters.findMany({})

        res.render('search', {
            'categories': categories,
            'items': items,
            'filters': filters,
            'genre': genre,
            'genres':genres,
            auth: req.session.auth,
            active: req.session.active,
            status: req.session.status,
            admin: req.session.admin,
            searchMove: req.session.searchMove,
            category: req.session.category,
            count: req.session.count,
        })

    }

    async cartoons(req: Request, res: Response) {
        const { name } = req.params;

        const genres = await prisma.cartoonGenres.findMany({
            where: {
                name
            }
        });

        const count = await prisma.items.count({
            where: {
                genre: {
                    contains: name
                },
                type: Number(req.session.category)
            }
        });
        if (count > 0) {
            let n = Math.ceil(count / 4)
            req.session.count = Math.ceil(count / 4)
            let itemsPerPage = 4

            let page = Number(req.query.page)
            if (!page) page = 1;
            if (page > n) page = n;
            let pages = itemsPerPage * (page - 1)


            const items = await prisma.items.findMany({
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
                k = k + 1
            }
            const categories = await prisma.categories.findMany({})
            const filters = await prisma.filters.findMany({})

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
        } else {
            const items = await prisma.items.findMany({
                where: {
                    genre: {
                        contains: name
                    },
                    type: Number(req.session.category)

                }

            });
            const categories = await prisma.categories.findMany({})
            const filters = await prisma.filters.findMany({})

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

    }

    async searchFilms(req: Request, res: Response) {

        const { name } = req.body;
        req.session.searchMove = false
        const items = await prisma.items.findMany({
            where: {
                genre: {
                    contains: name
                }
            }
        });
        if (items[0] != undefined) {
            req.session.searchMove = true
        } else {
            req.session.searchMove = false
        }

        const categories = await prisma.categories.findMany({})
        const genres = await prisma.genres.findMany({})
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
        })
    }

    async ByYear(req: Request, res: Response) {

        const { date } = req.params;
        const currentType = Number(req.session.category)
        const count = await prisma.items.count({
            where: {
                year: Number(date),
                type: Number(req.session.category)

            }
        });
        if (count > 0) {
            let n = Math.ceil(count / 4)
            req.session.count = Math.ceil(count / 4)
            let itemsPerPage = 4

            let page = Number(req.query.page)
            if (!page) page = 1;
            if (page > n) page = n;
            let pages = itemsPerPage * (page - 1)


            const items = await prisma.items.findMany({

                skip: pages,
                take: itemsPerPage,
                where: {
                    year: Number(date),
                    type: Number(req.session.category)

                }

            });
            const filters = await prisma.filters.findMany({})
            const categories = await prisma.categories.findMany({})
            let k = 0;
            for (let i = 0; i < items.length; i++) {
                k = k + 1
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
        } else {
            const categories = await prisma.categories.findMany({})
            const items = await prisma.items.findMany({
                where: {
                    year: Number(date),
                    type: Number(req.session.category)

                }

            });
            const filters = await prisma.filters.findMany({})

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
    }

    async ByGenre(req: Request, res: Response) {

        const { id } = req.params;
        req.session.active = "genre";
        const genres = await prisma.genres.findMany({})
        const cartoons = await prisma.cartoonGenres.findMany({})
        const categories = await prisma.categories.findMany({})
        const filters = await prisma.filters.findMany({})

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
    }

    async byFree(req: Request, res: Response) {

        req.session.active = "free";
        const items = await prisma.items.findMany({
            where: {
                status: 'бесплатно'
            }
        })

        const categories = await prisma.categories.findMany({})
        const filters = await prisma.filters.findMany({})

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
    }

    async onPaid(req: Request, res: Response) {
        req.session.active = "paid";

        const items = await prisma.items.findMany({
            where: {
                status: 'подписка'
            }
        })
        const categories = await prisma.categories.findMany({})

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
    }

    async ByCountry(req: Request, res: Response) {

        const { name } = req.params;
        const currentType = Number(req.session.category)
        const count = await prisma.items.count({
            where: {
                country: {
                    contains: name
                },
                type: currentType
            }
        });

        if (count > 0) {
            let n = Math.ceil(count / 4)
            req.session.count = Math.ceil(count / 4)
            let itemsPerPage = 4

            let page = Number(req.query.page)
            if (!page) page = 1;
            if (page > n) page = n;
            let pages = itemsPerPage * (page - 1)

            const items = await prisma.items.findMany({
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
                k = k + 1
            }

            const categories = await prisma.categories.findMany({})
            const filters = await prisma.filters.findMany({})

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
        } else {

            const items = await prisma.items.findMany({
                where: {
                    country: {
                        contains: name
                    },
                    type: currentType
                }
            });

            const categories = await prisma.categories.findMany({})
            const filters = await prisma.filters.findMany({})

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
    }


    async subscribe(req: Request, res: Response) {

        const items = await prisma.items.findMany({
            where: {
                status: 'подписка'
            }
        })
        
        const filters = await prisma.filters.findMany({})
        const categories = await prisma.categories.findMany({})
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
    }


    async free(req: Request, res: Response) {

        const items = await prisma.items.findMany({
            where: {
                status: 'бесплатно'
            }
        })

        const filters = await prisma.filters.findMany({})
        const categories = await prisma.categories.findMany({})

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
    }

    async filters(req: Request, res: Response) {

        const { id } = req.params;
        const filtersBar = await prisma.filters.findMany({
            where: {
                id: Number(id),
            }
        })

        const categories = await prisma.categories.findMany({})
        const filters= await prisma.filters.findMany({})
        const genres = await prisma.genres.findMany({})
        const cartoonGenres = await prisma.cartoonGenres.findMany({})
        const items = await prisma.items.findMany()
        const country = await prisma.country.findMany()
        const years = await prisma.years.findMany()

        if (filtersBar[0].title == 'free' || filtersBar[0].title == 'subscribe') {
            res.redirect(`/types/${filtersBar[0].title}`)
        } else {

            res.render(`types/${filtersBar[0].title}`, {
                'categories': categories,
                'filtersBar':filtersBar,
                'items':items,
                'filters': filters,
                'country':country,
                'years':years,
                'cartoonGenres':cartoonGenres,
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

    }
}



