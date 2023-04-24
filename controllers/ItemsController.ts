import { Request, Response } from 'express';
import { items, users, bascet,items__genres, comments,categories, PrismaClient } from '@prisma/client';
import { validateHeaderValue } from 'http';
// import "./authorizationcontroller"
const prisma: PrismaClient = new PrismaClient();

export class ItemsController {

    async dark(req: Request, res: Response) {
        req.session.dark__light = false
        res.render('home', {
            auth: req.session.auth,
            admin: req.session.admin,
            status: req.session.status,
            dark__light: req.session.dark__light,
            searchMove:req.session.searchMove,
        });
    }
    async light(req: Request, res: Response) {
        req.session.dark__light = true
        res.render('home', {
            auth: req.session.auth,
            admin: req.session.admin,
            status: req.session.status,
            dark__light: req.session.dark__light,
            searchMove:req.session.searchMove,
        });
    }
    async destroy(req: Request, res: Response) {
        const { id } = req.body;

        await prisma.items.deleteMany({
            where: {
                id: Number(id)
            }

        });
    
        res.redirect('/');
    }
    async home(req: Request, res: Response) {
        req.session.active = "genre";
        
        const items = await prisma.items.findMany({
            take:5,
            where:{
                status:'подписка'
            }
        })
        const genres = await prisma.genres.findMany({})
        const categories = await prisma.categories.findMany({})
            res.render('home', {
                'categories':categories,
                'genres':genres,
                'items':items,
             
                auth: req.session.auth,
                searchMove: req.session.searchMove,
                admin: req.session.admin,
                status: req.session.status,
                dark__light: req.session.dark__light,
            });
    }
    
    async homeSearch(req: Request, res: Response) {
        const { name } = req.body;
        const items = await prisma.items.findMany({
            where: {
                name: name
            }
        });

        res.render('home', {
            auth: req.session.auth,
            admin: req.session.admin,
            dark__light: req.session.dark__light,
            'items': items
        });
    }

    async Add(req: Request, res: Response) {
       const genres =  await prisma.genres.findMany({})
       const categories =  await prisma.categories.findMany({})
       const items =  await prisma.items.findMany({})
        res.render('items/create', {
            'genres': genres,
            'items':items,
            'categories':categories,
            auth: req.session.auth,
            admin: req.session.admin,
            status: req.session.status,
            dark__light: req.session.dark__light,
            category: req.session.category,
        });
    }
    async AddItems(req: Request, res: Response) {
        const {id, name, image, description, producer, actor, screenwriter, operator, regicer,year, age, country,status, video, treller } = req.body;
       
        let genres = await prisma.genres.findMany({})
        let mass = []
        let all = "";
        let one = "";
        for (let i= 0; i < genres.length; i++ ){
            one = req.body.check
           
        }
        
         
        const items = await prisma.items.create({
            data: {
                name: name,
                image: image,
                description: description,
                producer: producer,
                actor: actor,
                screenwriter: screenwriter,
                operator: operator,
                regicer: regicer,
                type: Number(req.body.check__radio),
                country: country,
                age: age,
                year: Number(year),
                genre:'fff',
                status : status,
                video:video,
                treller:treller,
            }
        });
        console.log(one)
       for(let i = 0; i < one.length;i++){
        let genres = await prisma.genres.findMany({
            where:{
                id:Number(one[i])
            }
        })
        await prisma.items__genres.create({
            data:{
                itemId:items.id,
                genreId:genres[0].id
            }
        })
        // console.log(genres[0].id)
       }
        req.session.status = status;

        res.redirect('items/create')
    }

    async bascet(req: Request, res: Response) {
        const { name, image, country, age, genre } = req.body;
        const bascet = await prisma.bascet.findMany({
            where: {
                name: name,
                image: image,
                country: country,
                age: age,
                genre: genre,
                Username:String(req.session.name)
            }
        });
        const categories = await prisma.categories.findMany({})
        res.render('cart/index', {
            name:req.session.name,
            auth: req.session.auth,
            admin: req.session.admin,
            status: req.session.status,
            category: req.session.category,
            dark__light: req.session.dark__light,
            'categories':categories,
            'bascet': bascet
        });
    }
    async users(req: Request, res: Response) {
        const {name, password} = req.body;
        const categories = await prisma.categories.findMany({})
        const users = await prisma.users.findMany({
            where: {
                name: name,
                password:password
            }
        });
        res.render('users', {
            name:req.session.name,
            auth: req.session.auth,
            status: req.session.status,
            admin: req.session.admin,
            category: req.session.category,
            dark__light: req.session.dark__light,
            'categories':categories,
            'users': users
        });
    }
    async description(req: Request, res: Response) {
        const { id } = req.params;
        const {nameId,commentName} = req.body;

       
        const items = await prisma.items.findUnique({
            where: {
                id: Number(id)
            }
           
        });
        const categories = await prisma.categories.findMany({
        });
         await prisma.items.findMany({ });
        
        const rating = await prisma.rating.findMany({
            where: {
                item__id: Number(id),
                name: String(req.session.name),
            }
        });
        await prisma.items.findMany({
            where: {
                name:nameId
            }
           
        });
        
        const comment = await prisma.comments.findMany({
            where: {
                move__id:Number(id),
            }
           
        });
        if (rating[0] != undefined) {

            req.session.mark = false

        } else {

            req.session.mark = true
        }

        // const {item__id} = req.body
        let arr = await prisma.rating.findMany({
            where:{
                item__id: Number(id)
            }
        })
        
        let summ = 0;
        let k = 0 ;
        
        for(let i = 0; i < arr.length; i++){
            summ = summ + arr[i].rate;
            k = i + 1;
        }
        let average = summ / k
        let rounded = Math.round(average * 10) / 10
      
        await prisma.comments.findMany({
            where: {
                user__name:String(commentName),
            }
           
        });
        await prisma.rating.findMany({
            where:{
                name:String(req.session.name),
            }
        })
        res.render('items/show', {
            'items': items,
            'rating' : rating,
            'comments': comment,
            'categories':categories,
            number:Number(rounded),
            voices : k,
            auth: req.session.auth,
            password: req.session.password,
            status: req.session.status,
            admin: req.session.admin,
            dark__light: req.session.dark__light,
            mark: req.session.mark,

        });




    }
    
    

    async renderDes(req: Request, res: Response) {
        const {id} = req.params
         const items = await prisma.items.findMany({
            where:{
                id:Number(id)
            }
         })
        
        res.render('description', {

            auth: req.session.auth,
            status: req.session.status,
            admin: req.session.admin,
            dark__light: req.session.dark__light,
            mark: req.session.mark
        });
    }

    async save__Video(req: Request, res: Response) {
        const { name, image, country, age, genre,Username} = req.body;
        const items = await prisma.items.findMany({
            where: {
                name: name,
                image: image,
                country: country,
                age: age,
                genre: genre
            }
        });

        await prisma.bascet.create({
            data: {
                name: name,
                image: image,
                country: country,
                age: age,
                genre: genre,
                Username:String(req.session.name)
            }
        });
        res.redirect('/bascet');
    }

    async delete__Video(req: Request, res: Response) {
        const { id } = req.params;
        const bascet = await prisma.bascet.delete({
            where: {
                id: Number(id)
            }
        });
        res.redirect('/bascet');
    }
    async delete__users(req: Request, res: Response) {
        const { id } = req.params;
        await prisma.users.deleteMany({
            where: {
                id: Number(id)
            }
        });
        res.redirect('/users');
    }
    async searchMove(req: Request, res: Response) {
        const { name } = req.body;
        const items = await prisma.items.findMany({
            where: {
                name:{
                    contains: name
                }
            }
           
        });
        if(items[0] != undefined){
            req.session.searchMove = true
        }else{
            req.session.searchMove = false
        }
        const categories = await prisma.categories.findMany({})
        const genres = await prisma.genres.findMany({})

        res.render('search',{
            'categories':categories,
            'genres':genres,
            'items': items,
            searchMove:req.session.searchMove,
            auth: req.session.auth,
            admin: req.session.admin,
            active:req.session.active,
            status: req.session.status,
            dark__light: req.session.dark__light,
            mark: req.session.mark
        })
    }

    async delete__moves(req: Request, res: Response) {
        const { id } = req.params;
        const items = await prisma.items.delete({
            where: {
                id: Number(id)
            }
        });
        const genres = await prisma.genres.findMany({

        })
        res.redirect("/movies")
    }
    async addGenre(req: Request, res: Response) {
        const categories = await prisma.categories.findMany({})

        res.render('items/create__genres', {
            name:req.session.name,
            auth: req.session.auth,
            status: req.session.status,
            admin: req.session.admin,
            category: req.session.category,
            dark__light: req.session.dark__light,
            'categories':categories,
        });
    }
    async addCategories(req: Request, res: Response) {
 
        const categories = await prisma.categories.findMany({})

        res.render('items/create__categories', {
            name:req.session.name,
            auth: req.session.auth,
            status: req.session.status,
            admin: req.session.admin,
            category: req.session.category,
            dark__light: req.session.dark__light,
            'categories':categories,
            
        });
    }
    async createGenre(req: Request, res: Response) {
        const {cartoonGenre, genre} = req.body;
        const categories = await prisma.categories.findMany({})
        await prisma.genres.create({
            data:{
                name:genre
            }
        })
        await prisma.cartoonGenres.create({
            data:{
                name:cartoonGenre
            }
        })
        res.redirect('/');
    }
    async createCategories(req: Request, res: Response) {
        const {categories} = req.body;
        await prisma.categories.create({
            data:{
                name:categories
            }
        })

        res.redirect('/');
    }
    async profile(req: Request, res: Response) {
        const items = await prisma.items.findMany({})
        const categories = await prisma.categories.findMany({})
        res.render('account/profile',{
            'items':items,
            'categories':categories,
            name:req.session.name,
            auth:req.session.auth,
            password:req.session.password,
            admin:req.session.admin
        });
    }
}



