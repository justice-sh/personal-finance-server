# Title: Personal Finance App

## Project setup

### Environment variables

You can find required env variables by looking at the env schema here -> `src\common\schemas\env.ts`

```bash
$ pnpm install
```

### Generate database migration scripts

```bash
# development
$ pnpm db:generate
```

### Perform database migration

```bash
# development
$ pnpm db:migrate
```

### Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

### Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

### Learn Drizzle + Postgress + NestJs

- [NestJS + Drizzle Deep Dive | Schemas, Relations, Migrations & More - Michael Guay](https://youtu.be/4xMDAqcwzp8?si=tsr8XBmvUcC9aWvJ)
- [Learn Drizzle In 60 Minutes - Web Dev Simplified](https://youtu.be/7-NZ0MlPpJA?si=29eLVYqLtcswc-jK)

### Other Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).
