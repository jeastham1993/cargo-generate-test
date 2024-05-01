use serde::Deserialize;
use crate::{ApplicationError, {{entity_name}}Repository};
use crate::view_models::{{entity_name}}ViewModel;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Get{{entity_name}}Query {
    pub customer_id: String,
    pub order_id: String
}

pub struct Get{{entity_name}}QueryHandler {
    order_repository: {{entity_name}}Repository
}

impl Get{{entity_name}}QueryHandler {
    pub fn new(order_repository: {{entity_name}}Repository) -> Self {
        Self {
            order_repository
        }
    }

    pub async fn handle(&self, query: Get{{entity_name}}Query) -> Result<{{entity_name}}ViewModel, ApplicationError>{
        tracing::info!("Query for customer '{}' and order '{}'", query.customer_id, query.order_id);

        let order = self.order_repository.get_by_id(query.customer_id, query.order_id).await?;

        Ok(order.into())
    }
}