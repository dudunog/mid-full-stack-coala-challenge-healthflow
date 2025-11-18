import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: amqp.ChannelModel | null = null;
  private channel: amqp.ConfirmChannel | null = null;
  private connectionPromise: Promise<void> | null = null;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    this.connectionPromise = this.connect();
    await this.connectionPromise;
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    try {
      const rabbitmqUrl =
        this.configService.get<string>('RABBITMQ_URL') ||
        'amqp://guest:guest@localhost:5672';

      this.connection = await amqp.connect(rabbitmqUrl);
      this.channel = await this.connection.createConfirmChannel();

      this.logger.log('Connected to RabbitMQ');
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error);
      throw error;
    }
  }

  private async disconnect(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
      }
      if (this.connection) {
        await this.connection.close();
        this.connection = null;
      }
      this.logger.log('Disconnected from RabbitMQ');
    } catch (error) {
      this.logger.error('Error disconnecting from RabbitMQ', error);
    }
  }

  private ensureChannel(): amqp.ConfirmChannel {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not initialized');
    }
    return this.channel;
  }

  async waitForConnection(): Promise<void> {
    if (this.channel) {
      return;
    }
    if (this.connectionPromise) {
      await this.connectionPromise;
      return;
    }
    throw new Error('RabbitMQ connection not initialized');
  }

  async assertQueue(
    queueName: string,
    options?: amqp.Options.AssertQueue,
  ): Promise<void> {
    const channel = this.ensureChannel();
    await channel.assertQueue(queueName, {
      durable: true,
      ...options,
    });
  }

  async assertQueueWithDLQ(queueName: string, dlqName: string): Promise<void> {
    const channel = this.ensureChannel();

    await channel.assertQueue(dlqName, {
      durable: true,
    });

    await channel.assertQueue(queueName, {
      durable: true,
      deadLetterExchange: '',
      deadLetterRoutingKey: dlqName,
    });

    this.logger.log(`Queue ${queueName} configured with DLQ ${dlqName}`);
  }

  async publish(
    queueName: string,
    message: unknown,
    options?: amqp.Options.Publish,
  ): Promise<void> {
    const channel = this.ensureChannel();

    try {
      await this.assertQueue(queueName);

      const messageBuffer = Buffer.from(JSON.stringify(message));
      const sent = channel.sendToQueue(queueName, messageBuffer, {
        persistent: true,
        ...options,
      });

      if (!sent) {
        throw new Error(`Failed to publish message to queue ${queueName}`);
      }

      this.logger.debug(`Published message to queue ${queueName}`);
    } catch (error) {
      this.logger.error(
        `Failed to publish message to queue ${queueName}`,
        error,
      );
      throw error;
    }
  }

  async consume(
    queueName: string,
    callback: (message: unknown) => Promise<void>,
    options?: amqp.Options.Consume & { dlqName?: string },
  ): Promise<void> {
    const channel = this.ensureChannel();

    try {
      const { dlqName, ...consumeOptions } = options || {};

      if (dlqName) {
        await this.assertQueueWithDLQ(queueName, dlqName);
      } else {
        await this.assertQueue(queueName);
      }

      await channel.consume(
        queueName,
        async (msg) => {
          if (!msg) {
            return;
          }

          try {
            const content = JSON.parse(msg.content.toString());
            await callback(content);
            channel.ack(msg);
          } catch (error) {
            this.logger.error(
              `Error processing message from queue ${queueName}`,
              error,
            );
            channel.nack(msg, false, false);
          }
        },
        {
          noAck: false,
          ...consumeOptions,
        },
      );

      this.logger.log(`Consuming messages from queue ${queueName}`);
    } catch (error) {
      this.logger.error(
        `Failed to consume messages from queue ${queueName}`,
        error,
      );
      throw error;
    }
  }
}
