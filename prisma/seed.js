const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function category() {
    const createCategory = await prisma.categories.createMany({
        data: [
            { name: "фильмы" },
            { name: "сериалы" },
            { name: "мультфильмы"}
        ],
        skipDuplicates: true
        }
    );
   
}

async function genres() {
    const createGenre = await prisma.genres.createMany({
        data: [
            { 
                name: "боевик" ,
               
            },
            {
                name: "комедии",
         
            },
            { 
                name: "романтика",
               
            },
            { 
                name: "драма",
              
            },
            { 
                name: "мелодрама",
             
            },
            {
                name: "триллер",
               
            },
            {
                name: "исторический",
               
            },
            {  
                name: "трагедия",
             
            },
            {
                name: "фантастика",
             
                },
            { 
                name: "приключения",
            
            },
            { 
                name: "семейный",
               
            },
            { 
                name: "детский",
           
            },
            {
                 name: "детектив",
          
            },
            { 
                name: "мистика",
            
            },
            {
                 name: "криминал",
             
            },    
        ],
        skipDuplicates: true
        }
    );
}
async function years() {
    const years = await prisma.years.createMany({
        data: [
            { 
                name: "2023 год",
                date: 2023
            },
            { 
                name: "2022 год",
                date: 2022
            },
            { 
                name: "2021 год",
                date: 2021
            },
            { 
                name: "2020 год",
                date: 2020
            },
            { 
                name: "2019 год",
                date: 2019
            },
            { 
                name: "2018 год",
                date: 2018
            },
            { 
                name: "2017 год",
                date: 2017
            },
            { 
                name: "2016 год",
                date: 2016
            },
            { 
                name: "2015 год",
                date: 2015
            },
            { 
                name: "2010-ые годы",
                date: 2010
            },
            { 
                name: "2000-ые года",
                date: 2000
            },
            { 
                name: "1990-ые года",
                date: 1990
            },
            { 
                name: "1890-ые года",
                date: 1890
            },
        ],  
        skipDuplicates: true
        }
    );
   
}
async function cartoonGenres() {
    const createGenre = await prisma.cartoonGenres.createMany({
        data: [
            { 
                name: "боевик",
            
            },
            { 
                name: "романтика",
               
            },
            { 
                name: "исторический",
              
            },
            { 
                name: "фантастика",
             
            },
            {
                 name: "приключения",
            
            },
            { 
                name: "семейный",
           
            },
            {
                 name: "детектив",
            },
            {
                 name: "мистика",
             
            },
            {
                 name: "военный мультфильм",
           
            },  
            {
                 name: "развлекательный",
        
            },   
            {
                 name: "учебный",
             
            },   
        ],
        skipDuplicates: true
        }
    );
}

async function users() {
    const users = await prisma.users.createMany({
        data: [
            { 
                name: "Admin" ,
                password: '$2b$10$jOW3VhJ7k8lPagE4/S.BL.d67YNfmAtJsEXPMPzUe3f463SAKPWv2',
                status:'подписка',
                avatar:'Alto.png',
                type:"Admin"

            },  
        ],
        skipDuplicates: true
        }
    );
}

async function filters() {
    const filters = await prisma.filters.createMany({
        data: [
            { 
                name: "Жанры",
                title:"genre"}, 
            { 
                name: "Годы",
                title:"years"}, 
            { 
                name: "Страны",
                title: "Country"}, 
            { 
                name: "платные",
                title: "subscribe"}, 
            { 
                name: "бесплатные",
                title: "free"
            }, 
        ],
        skipDuplicates: true
        }
    );
}
async function country() {
    const country = await prisma.country.createMany({
        data: [
            { 
                name: "Россия" ,
            },  
            { 
                name: "СССР" ,
            },
            { 
                name: "США" ,
            },
            { 
                name: "Франция" ,
            },
            { 
                name: "Южная Корея" ,
            },
            { 
                name: "Великобритания" ,
            },  
            { 
                name: "Япония" ,
            },
            { 
                name: "Италия" ,
            },
            { 
                name: "Испания" ,
            },
            { 
                name: "Германия" ,
            },
            { 
                name: "Турция" ,
            },
            { 
                name: "Швеция" ,
            },
            { 
                name: "Дания" ,
            },

        ],
        skipDuplicates: true
        }
    );
}
country()
years()
filters()
category()
genres()
cartoonGenres()
users()


    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.log(e);
        await prisma.$disconnect();
        process.exit(1); 
    })