use serde::Deserialize;

use crate::{ApplicationError, {{entity_name}}Repository};
use crate::view_models::{{entity_name}}ViewModel;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Update{{entity_name}}Command {
    customer_id: String,
    order_id: String,
    order_data: String,
}

pub struct Update{{entity_name}}CommandHandler {
    order_repository: {{entity_name}}Repository
}

impl Update{{entity_name}}CommandHandler {
    pub fn new(order_repository: {{entity_name}}Repository) -> Self {
        Self {
            order_repository
        }
    }

    pub async fn handle(&self, command: Update{{entity_name}}Command) -> Result<{{entity_name}}ViewModel, ApplicationError>{
        let mut order = self.order_repository.get_by_id(command.customer_id, command.order_id).await?;

        order.update_order_data(command.order_data);

        self.order_repository.update(&order).await?;

        Ok(order.into())
    }
}