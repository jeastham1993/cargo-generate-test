use serde::Deserialize;

use crate::{ApplicationError, {{entity_name}}, {{entity_name}}Repository};
use crate::view_models::{{entity_name}}ViewModel;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Create{{entity_name}}Command {
    customer_id: String,
    order_data: String,
}

pub struct Create{{entity_name}}CommandHandler {
    order_repository: {{entity_name}}Repository
}

impl Create{{entity_name}}CommandHandler {
    pub fn new(order_repository: {{entity_name}}Repository) -> Self {
        Self {
            order_repository
        }
    }

    pub async fn handle(&self, command: Create{{entity_name}}Command) -> Result<{{entity_name}}ViewModel, ApplicationError>{
        let order = {{entity_name}}::new(command.customer_id, command.order_data);

        self.order_repository.add(&order).await?;

        Ok(order.into())
    }
}