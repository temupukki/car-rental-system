"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const better_auth_1 = require("better-auth");
const prisma_1 = require("better-auth/adapters/prisma");
const prisma_2 = __importDefault(require("./prisma"));
const dotenv = __importStar(require("dotenv"));
const Email_1 = require("./Email");
const nodemailer_1 = require("./nodemailer");
const password_reset_1 = require("./password-reset");
dotenv.config();
exports.auth = (0, better_auth_1.betterAuth)({
    database: (0, prisma_1.prismaAdapter)(prisma_2.default, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url, token }, request) => {
            const emailTemplate = (0, password_reset_1.getPasswordResetEmailTemplate)({ user, url });
            await (0, nodemailer_1.sendEmail)({
                to: user.email,
                subject: emailTemplate.subject,
                text: emailTemplate.text,
                html: emailTemplate.html,
            });
        }
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }, request) => {
            const emailTemplate = (0, Email_1.getVerificationEmailTemplate)({ user, url });
            await (0, nodemailer_1.sendEmail)({
                to: user.email,
                subject: emailTemplate.subject,
                text: emailTemplate.text,
                html: emailTemplate.html,
            });
        },
        sendOnSignUp: true
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    user: {
        additionalFields: {
            role: {
                type: ["USER", "ADMIN"]
            }
        }
    },
    trustedOrigins: ["http://localhost:5173"]
});
