import amqplib from 'amqplib'
import logger from '../utils/logger'

export enum RabbitMQQueue {
	tx = 'tx'
}

export async function publishTask(
	channel: amqplib.Channel,
	queueName: RabbitMQQueue,
	message: object
): Promise<void> {
	try {
		await channel.assertQueue(queueName, { durable: true })

		const sent = channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
			persistent: true
		})

		if (sent) {
			logger.info(`Task published to queue ${queueName}`)
		} else {
			logger.warn(`Failed to publish task to queue ${queueName}`)
		}
	} catch (error) {
		logger.error(`Error publishing task to queue ${queueName}: ${error}`)
		throw error
	}
}
