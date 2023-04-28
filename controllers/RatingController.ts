import { Request, Response } from 'express';
import { items, users, basket, comments, PrismaClient } from '@prisma/client';
import { validateHeaderValue } from 'http';
import { Console } from 'console';
// import "./authorizationcontroller"
const prisma: PrismaClient = new PrismaClient();

export class RatingController {


    async rating(req: Request, res: Response) {
        const { item__id, rate, text } = req.body;
        const { id } = req.params;
        await prisma.items.findUnique({
            where: {
                id: Number(id)
            }

        })
        const rating = await prisma.rating.create({
            data: {
                rate: Number(rate),
                name: String(req.session.name),
                item__id: Number(id)
            }
            
            
        })
        await prisma.items.findMany({
            where:{
                id:Number(1)
            }
        })
       await prisma.comments.create({
            data: {
                text: text,
                user__name: String(req.session.name),
                move__id: Number(id)
            }
        })
        req.session.mark = false
       
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

        res.redirect(`/des__film/${id}`)
    }

}