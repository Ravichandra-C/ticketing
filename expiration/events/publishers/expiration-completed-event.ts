import {
  ExpirationCompletedEvent,
  Publisher,
  Subjects,
} from "@rcrcticket/common";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
}
