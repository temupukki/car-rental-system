"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const prismaClientSingleton = () => {
    return new prisma_1.PrismaClient();
};
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
exports.default = prisma;
if (process.env.NODE_ENV !== 'production')
    globalThis.prismaGlobal = prisma;
