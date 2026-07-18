import 'dotenv/config';

export const config = {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    standardUser: {
        username: process.env.STANDARD_USERNAME ?? 'standard_user',
        password: process.env.STANDARD_PASSWORD ?? 'secret_sauce',
    },
};
