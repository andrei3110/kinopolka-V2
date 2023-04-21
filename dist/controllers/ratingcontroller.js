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
exports.RatingController = void 0;
const client_1 = require("@prisma/client");
// import "./authorizationcontroller"
const prisma = new client_1.PrismaClient();
class RatingController {
    rating(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { item__id, rate, text } = req.body;
            const { id } = req.params;
            yield prisma.items.findUnique({
                where: {
                    id: Number(id)
                }
            });
            const rating = yield prisma.rating.create({
                data: {
                    rate: Number(rate),
                    name: String(req.session.name),
                    item__id: Number(id)
                }
            });
            yield prisma.items.findMany({
                where: {
                    id: Number(1)
                }
            });
            yield prisma.comments.create({
                data: {
                    text: text,
                    user__name: String(req.session.name),
                    move__id: Number(id)
                }
            });
            req.session.mark = false;
            let arr = yield prisma.rating.findMany({
                where: {
                    item__id: Number(id)
                }
            });
            let summ = 0;
            let k = 0;
            for (let i = 0; i < arr.length; i++) {
                summ = summ + arr[i].rate;
                k = i + 1;
            }
            let average = summ / k;
            let rounded = Math.round(average * 10) / 10;
            res.redirect(`/des__film/${id}`);
        });
    }
}
exports.RatingController = RatingController;
