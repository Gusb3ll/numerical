import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'

const main = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ bodyLimit: 104857600 }),
    { bodyParser: true, cors: { origin: '*' } },
  )

  const config = new DocumentBuilder().setTitle('Numerical API').build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(4000, '0.0.0.0').then(() => {
    console.log(`\nListening at http://127.0.0.1:4000/[path]`)
  })
}

main()
