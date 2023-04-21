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
exports.CommentsController = void 0;
const client_1 = require("@prisma/client");
// import "./authorizationcontroller"
const prisma = new client_1.PrismaClient();
class CommentsController {
    delete__comment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { move__id, text, item__id, itemsID, user__name, nameId, commentId, ratingId } = req.body;
            const items = yield prisma.items.findUnique({
                where: {
                    id: Number(id)
                }
            });
            yield prisma.comments.deleteMany({
                where: {
                    id: Number(commentId),
                    user__name: String(req.session.name)
                }
            });
            const comment = yield prisma.comments.findMany({
                where: {
                    move__id: Number(id),
                }
            });
            let arr = yield prisma.rating.findMany({
                where: {
                    item__id: Number(id)
                }
            });
            yield prisma.items.findMany({});
            const rating = yield prisma.rating.deleteMany({
                where: {
                    name: String(req.session.name),
                    item__id: Number(itemsID)
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
            res.redirect(`/des__film/${itemsID}`);
        });
    }
}
exports.CommentsController = CommentsController;
