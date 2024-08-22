# Description

Introducing, Nelfix, A fresh take on streaming that redefines how you watch movies and other exclusive contents.
We’re not just another platform; we’re a community that brings the joy of cinema right to your fingertips.

# Table Of Contents

- [Description](#description)
- [Table Of Contents](#table-of-contents)
- [Author](#author)
- [How To Run](#️how-to-run)
- [Design Pattern](#design-pattern)
- [Tech Stack Used](#tech-stack-used)
- [Endpoints Made](#️endpoints-made)
- [Bonus](#bonus)
- [Bonus Explanation](#bonus-explanation)

# Author

|   NIM    |           Nama           |
| :------: | :----------------------: |
| 13522066 | Nyoman Ganadipa Narayana |

# How To Run

To access the app, you can go to one of the links:

- [labpro.nyomanganadipa.com](https://labpro.nyomanganadipa.com/)

- Or you can use your local, by doing:

1.  clone the repository, then go to the `dev` branch

```bash
cp .env.example .env
cp .env.example .env.docker
```

2. Then fill in using your own variables.

3. then do

```bash
pnpm i
bash run.sh local
```

4. Optionally, If you want to seed the web apps, use
   ```bash
   bash run.sh seed```

# Design Pattern

## Decorator pattern

- Separation of Concern, mengekstensi sebuah fungsionalitas dari sebuah method agar memiliki sebuah mekanisme authentication (Roles decorator)

- Scalability, Adanya role baru tidak akan mengubah role yang ada.

## Singleton pattern

- Consistency, Meyakinkan bahwa hanya ada 1 state untuk 1 class yang sama. Sehingga meskipun suatu module dipakai diberbagai module lainnya, state yang digunakan akan tetap sama.

## Strategy pattern

- Scalability, Perubahan metode authorization dari JWT menjadi yang lain (Katakanlah Db session) tidak akan mengubah kode yang lama, tetapi hanya menambah kode yang baru.

## Factory pattern

- Scalability dan Maintainability, semakin aplikasi ini berkembang, seeding untuk development juga akan semakin membesar. Untuk mempercepat seeding, tidak perlu dilakukan seeding ulang, dapat dilakukan incremental seeding. Oleh karena itu saya membuat module seeding ini sedemikian sehingga mengimplementasi factory.

# Tech Stack Used

- TypeScript Compiler (v4.5.4)
- Docker (v27.1.2)
- Nest Js CLI (v10.4.2)
- Argon2 (v0.40.3)
- Firebase (v10.12.5)
- Firebase Admin (v12.3.1)
- Cypress (v13.13.3)
- Handlebars (v4.2.0)
- Prisma (v5.18.0)
- Tailwind CSS (v3.4.9)
- UUID (v10)

# Endpoints Made

## API Panel (/api)

- For api documentations

## REST API

- For admin role only.

### /films (POST)

- To create a new films

### /films (GET)

- To get all films that matches the given query.

### /films/{id} (GET)

- To get the film that matches the id

### /films/{id} (PUT)

- To update the film that matches the id

### /films/{id} (DELETE)

- To delete the film that matches the id

### /login (POST)

- To get the access token for the related payload

### /self (GET)

- To get the user information based on the authorization bearer token.

### /users (GET)

- To get all the registered users.

### /users/{id} (GET)

- To get the user that matches the given id

## Front End

### / (GET)

- To see the home page

### /web/films (GET)

- To see all the films that matches the query, or all films is the query is not set

### /web/films/{filmid} (GET)

- To see the details of the film that matches the filmid.

### /web/my-list (GET)

- To see the purchased films by the user. (Logged In only)

### /web/profile (GET)

- To see the profile of the user (Logged In only)

### /auth/login (GET)

- To see the login form (Guest only)

### /auth/register (GET)

- To see the register form (Guest only)

## Internal API

### /api/register (POST)

- To register a user.

### /api/login (POST)

- To login

### /api/buy-film (POST)

- To buy a film that matches the payload's film id.

### /api/logout (POST)

- To perform logout

### /api/review (POST)

- To review a film that matches the payload's films id.

# Bonus

- B01 - OWASP
- B02 - Deployment
- B05 - Lighthouse
- B06 - Responsive layout
- B07 - Dokumentasi API
- B08 - SOLID
- B09 - Automated testing
- B10 - Fitur Tambahan
- B11 - Ember

# Bonus Explanation

## B01 - OWASP

#### Injection

1. Sql Injection

- Use `' OR '1'='1` for both username and password in a naive and insecure website leads to

```sql
SELECT * FROM users WHERE username = '' OR '1'='1' AND password = '' OR '1'='1';
```

- But when performed on this web app, it leads to an error because of invalid credentials.

2. XSS

Create an account using `<script>alert('XSS');</script>` as the username, as it will be displayed when you log in. However, when it is displayed, it automatically gets escaped because Handlebars handles this.

Additionally, the web app has set httpOnly to true for the token cookie, so even if our app is vulnerable, XSS won't be able to access the cookie.

#### Security Misconfiguration

If someone closely examine my commit history, searching for any mistake committing a `.env`, They won't find it.

#### Broken Access Control

Every endpoint has been configured to grant access only to authorized users.

## B02 - Deployment

Aplikasi web ini telah di-deploy pada [labpro.nyomanganadipa.com](https://labpro.nyomanganadipa.com/)

## B05 - Lighthouse

### Home Page

![Home - Desktop](/assets/lighthouse/home-desktop.png)
![Home - Mobile](/assets//lighthouse/home-mobile.png)

### Browse Page

![Browse - Desktop](/assets/lighthouse/browse-desktop.png)
![Browse - Mobile](/assets/lighthouse/browse-mobile.png)

### Profile Page

![Profile - Desktop](/assets/lighthouse/profile-desktop.png)
![Profile - Mobile](/assets/lighthouse/profile-mobile.png)

### My List Page

![My List - Desktop](/assets/lighthouse/my-list-desktop.png)
![My List - Mobile](/assets/lighthouse/my-list-mobile.png)

### Login Page

![Login - Desktop](/assets/lighthouse/login-desktop.png)
![Login - Mobile](/assets/lighthouse/login-mobile.png)

### Register Page

![Register - Desktop](/assets/lighthouse/register-desktop.png)
![Register - Mobile](/assets/lighthouse/register-mobile.png)

## B06 - Responsive Layout

Responsive layout dapat dicoba pada [labpro.nyomanganadipa.com](https://labpro.nyomanganadipa.com/)

## B07 - Dokumentasi API

Dokumentasi API dapat dilihat pada [labpro.nyomanganadipa.com/api](https://labpro.nyomanganadipa.com/api/)

## B08 - SOLID

#### S: Single Responsibility

- Menggunakan prinsip separation of concern, setiap module hanya bertanggung jawab atas satu area, dan hanya satu.
- Setiap class di dalam module juga hanya memiliki satu concern, misal service untuk melakukan business logic, controller untuk menghubungkan client dan business logic, dan repository untuk mengakses data terkait.

#### O: Open/Closed Principle

- Strategy pattern yang digunakan untuk strategy authorization membuat aplikasi ini dapat mengganti implementasi authorization tanpa memodifikasi kode yang ada, tetapi menambahnya.

#### L: Liskov Substitution Principle

- Setiap repository yang mengimplementasi interfacenya menandakan bahwa setiap subclass harus memiliki implementasi dari interfacenya. Jadi apabila suatu interface diganti keberadaannya menjadi subclassnya, maka program tetap akan berjalan dengan aman.

#### I: Interface Segregation

- Setiap repository mengimplementasikan interfacenya hanya berdasarkan apa yang dibutuhkan
- Setiap authorization startegy mengimplementasikan hanya berdasarkan apa yang dibutuhkan

#### D: Dependency Inversion

- Setiap modul yang membutuhkan repository hanya bergantung pada interface daripada implementasinya. Ini memastikan bahwa logika tingkat tinggi tidak bergantung pada logika tingkat rendah. Sehingga suatu waktu saat dibutuhkan bisa mengimplementasikan repository metode lain.

## B09 - Automated testing

Dilakukan Automated e2e testing untuk bagian front end pada 5 dari 7 halaman yang tersedia. To run the test, do

```bash
npx cypress open
```

but make sure you have the cypress installed

```bash
pnpm cypress install
```

or just check it with

```bash
pnpm cypress -v
```

1. Films Page
   ![Films Page - Guest](/assets/cypress/films/guest.png)
   ![Films Page - User](/assets/cypress/films/user.png)

2. Home Page
   ![Home Page](/assets/cypress/home.png)

3. Login Page
   ![Login Page](/assets/cypress/login.png)

4. Register Page
   ![Register Page](/assets/cypress/register.png)

5. Profile Page
   ![Profile Page](/assets/cypress/profile.png)

## B10 - Fitur Tambahan

- Fitur Review Film
- Fitur Top 5 highest rated movie of the month

## B11 - Ember

- Pada web apps ini, diguankan firebase sebagai cloud storage object yang menyimpan setiap image file dan video file dari setiap films pada aplikasi ini.
