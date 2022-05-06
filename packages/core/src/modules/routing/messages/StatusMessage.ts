import { Expose, Transform } from 'class-transformer'
import { Equals, IsBoolean, IsDate, IsInt, IsOptional, IsString } from 'class-validator'

import { AgentMessage } from '../../../agent/AgentMessage'
import { ReturnRouteTypes } from '../../../decorators/transport/TransportDecorator'
import { DateParser } from '../../../utils/transformers'

export interface StatusMessageOptions {
  id?: string
  recipientKey?: string
  messageCount: number
  longestWaitedSeconds?: number
  newestReceivedTime?: Date
  oldestReceivedTime?: Date
  totalBytes?: number
  liveDelivery?: boolean
}

export class StatusMessage extends AgentMessage {
  public constructor(options: StatusMessageOptions) {
    super()
    if (options) {
      this.id = options.id || this.generateId()
      this.recipientKey = options.recipientKey
      this.messageCount = options.messageCount
      this.longestWaitedSeconds = options.longestWaitedSeconds
      this.newestReceivedTime = options.newestReceivedTime
      this.oldestReceivedTime = options.oldestReceivedTime
      this.totalBytes = options.totalBytes
      this.liveDelivery = options.liveDelivery
    }
    this.setReturnRouting(ReturnRouteTypes.all)
  }

  @Equals(StatusMessage.type)
  public readonly type = StatusMessage.type
  public static readonly type = 'https://didcomm.org/messagepickup/2.0/status'

  @IsString()
  @IsOptional()
  @Expose({ name: 'recipient_key' })
  public recipientKey?: string

  @IsInt()
  @Expose({ name: 'message_count' })
  public messageCount!: number

  @IsInt()
  @IsOptional()
  @Expose({ name: 'longest_waited_seconds' })
  public longestWaitedSeconds?: number

  @Expose({ name: 'newest_received_time' })
  @Transform(({ value }) => DateParser(value))
  @IsDate()
  @IsOptional()
  public newestReceivedTime?: Date

  @IsOptional()
  @Transform(({ value }) => DateParser(value))
  @IsDate()
  @Expose({ name: 'oldest_received_time' })
  public oldestReceivedTime?: Date

  @IsOptional()
  @IsInt()
  @Expose({ name: 'total_bytes' })
  public totalBytes?: number

  @IsOptional()
  @IsBoolean()
  @Expose({ name: 'live_delivery' })
  public liveDelivery?: boolean
}