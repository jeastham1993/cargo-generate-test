import { Construct } from "constructs";
import { RustFunction } from "cargo-lambda-cdk";
import { Architecture, StartingPosition } from "aws-cdk-lib/aws-lambda";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { ITopic } from "aws-cdk-lib/aws-sns";

export class FunctionProps{
    table: ITable
    {{entity_name}}CreatedTopic: ITopic
    {{entity_name}}UpdatedTopic: ITopic
    {{entity_name}}DeletedTopic: ITopic
}

export class EventPublisherFunction extends Construct {

    constructor(scope: Construct, id: string, props: FunctionProps) {
        super(scope, id);

        const eventPublisherFunction = new RustFunction(this, "EventPublisherFunction", {
            manifestPath: "../lambdas/event-publisher",
            memorySize: 128,
            architecture: Architecture.ARM_64,
            environment: {
              TABLE_NAME: props.table.tableName,
              {{entity_name}}_CREATED_TOPIC: props.{{entity_name}}CreatedTopic.topicArn,
              {{entity_name}}_UPDATED_TOPIC: props.{{entity_name}}UpdatedTopic.topicArn,
              {{entity_name}}_DELETED_TOPIC: props.{{entity_name}}DeletedTopic.topicArn,
            },
          });

        props.table.grantStreamRead(eventPublisherFunction);
        props.{{entity_name}}CreatedTopic.grantPublish(eventPublisherFunction);
        props.{{entity_name}}UpdatedTopic.grantPublish(eventPublisherFunction);
        props.{{entity_name}}DeletedTopic.grantPublish(eventPublisherFunction);

        eventPublisherFunction.addEventSource(new DynamoEventSource(props.table, {
            startingPosition: StartingPosition.LATEST
        }));
    }
}