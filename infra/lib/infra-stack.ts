import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { AttributeType, BillingMode, StreamViewType, Table } from "aws-cdk-lib/aws-dynamodb";
import {
  Resource,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { GetByIdEndpoint } from "./constructs/get-by-id-endpoint";
import { DeleteByIdEndpoint } from "./constructs/delete-by-id-endpoint";
import { UpdateByIdEndpoint } from "./constructs/update-by-id-endpoint";
import { PostEndpoint } from "./constructs/post-endpoint";
import { EventPublisherFunction } from "./constructs/event-publisher-function";
import { Topic } from "aws-cdk-lib/aws-sns";
import { StringParameter } from "aws-cdk-lib/aws-ssm";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new Table(this, "ApiTable", {
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: { name: "PK", type: AttributeType.STRING },
      sortKey: { name: "SK", type: AttributeType.STRING },
      stream: StreamViewType.NEW_AND_OLD_IMAGES
    });

    const api = new RestApi(this, "{{entity_name}}RestApi", {
      description: "{{entity_name}} API",
      restApiName: "{{entity_name}} API",
      disableExecuteApiEndpoint: false,
      deployOptions: {
        stageName: `main`,
      },
    });

    const customerIdResource = new Resource(this, "CustomerIdApiResource", {
      parent: api.root,
      pathPart: "{customerId}",
    });
    const orderIdResource = new Resource(this, "{{entity_name}}IdApiResource", {
      parent: customerIdResource,
      pathPart: "{orderId}",
    });

    const postEndpoint = new PostEndpoint(this, "PostEndpoint", {
      table: table,
      apiResource: api.root
    });

    const getByIdEndpoint = new GetByIdEndpoint(this, "GetByIdEndpoint", {
      table: table,
      apiResource: orderIdResource
    });

    const deleteByIdEndpoint = new DeleteByIdEndpoint(this, "DeleteByIdEndpoint", {
      table: table,
      apiResource: orderIdResource
    });

    const updateByIdEndpoint = new UpdateByIdEndpoint(this, "UpdateByIdEndpoint", {
      table: table,
      apiResource: orderIdResource
    });

    const {{entity_name}}CreatedTopic = new Topic(this, "{{entity_name}}CreatedTopic");
    const {{entity_name}}UpdatedTopic = new Topic(this, "{{entity_name}}UpdatedTopic");
    const {{entity_name}}DeletedTopic = new Topic(this, "{{entity_name}}DeletedTopic");

    const eventPublisherFunction = new EventPublisherFunction(this, "EventPublisherFunction", {
      table: table,
      {{entity_name}}CreatedTopic,
      {{entity_name}}UpdatedTopic,
      {{entity_name}}DeletedTopic
    });

    const orderCreatedTopicArnParameter = new StringParameter(this, "{{entity_name}}CreatedTopicArn", {
      stringValue: {{entity_name}}CreatedTopic.topicArn,
      parameterName: "/{{entity_name}}-api/order-created"
    });
    const orderUpdatedTopicArnParameter = new StringParameter(this, "{{entity_name}}UpdatedTopicArn", {
      stringValue: {{entity_name}}UpdatedTopic.topicArn,
      parameterName: "/{{entity_name}}-api/order-updated"
    });
    const orderDeletedTopicArnParameter = new StringParameter(this, "{{entity_name}}DeletedTopicArn", {
      stringValue: {{entity_name}}DeletedTopic.topicArn,
      parameterName: "/{{entity_name}}-api/order-deleted"
    });

    const apiEndpoint = new cdk.CfnOutput(this, "ApiUrlOutput", {
      exportName: "ApiEndpoint",
      value: api.url
    });
  }
}
